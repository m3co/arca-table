import * as React from 'react';

import { Input } from './Input';
import { Search } from './Search';

import { Row, Field } from 'arca-redux';
import { SearchSocket } from './Search-socket';

import './TCell.less';

interface Props {
  Field: Field;
  Row: Row;
  onEdit?: (Row: Row, column?: keyof Row, Field?: Field) => void;
  socket?: SearchSocket;
}

interface State {
  edit: boolean;
  dirty: boolean;
  value: string;
  column?: keyof Row;
}

export class TCell
  extends React.Component<Props, State>
{
  public state: State = {
    edit: false,
    dirty: false,
    value: '',
  }

  public constructor(props: Props) {
    super(props);

    const { Field, Row } = this.props;
    const columns = Object.keys(Row) as (keyof typeof Row)[];
    const column = columns.find((column): boolean =>
      column === Field.Name
    );
    if (column) {
      const value = Row[column];
      this.state.value = value ? value.toString() : '';
      this.state.column = column;
    }
  }

  public componentDidUpdate(prevProps: Props): void {
    const { props, state } = this;
    if (state.column && prevProps.Row !== props.Row) {
      const value = props.Row[state.column];
      this.setState((state: State): State => {
        return {
          ...state,
          value: value ? value.toString() : '',
          dirty: false
        };
      });
    }
  }

  private startEdit = (): void => {
    if (this.props.Field.Primary) return;
    if (!this.props.Field.Editable) return;
    this.setState((state: State): State => {
      return {
        ...state,
        edit: true,
      };
    });
  }

  private cancelEdit = (): void => {
    this.setState((state: State): State => {
      return {
        ...state,
        edit: false,
      };
    });
  }

  private finishEdit = (column: keyof Row): (currentValue: string) => void => (currentValue: string): void => {
    this.setState((state: State): State => {
      if (this.props.onEdit) {
        const { Field, Row } = this.props;
        const newRow = {
          ...Row,
          [column]: currentValue,
        };
        (currentValue !== state.value) && this.props.onEdit(newRow, column, Field);
      }
      return {
        ...state,
        value: currentValue,
        edit: false,
        dirty: currentValue !== state.value,
      }
    });
  }

  public render(): JSX.Element {
    const { Field, Row, socket: search } = this.props;
    const { Combobox } = Field;
    const { value, column, dirty } = this.state;
    const className = `${Field.Primary ? 'primary' : ''} ${dirty ? 'dirty' : ''}`.trim();
    return (column) ?
      (
        <td
          className={className ? className : undefined}
          onClick={this.startEdit}>
          {(this.state.edit) ? (
            (search && Combobox) ? (
              <Search
                socket={search}
                Row={Row}
                Setup={Combobox}
                value={value.toString()}
                onBlur={this.finishEdit(column)}
                onEnter={this.finishEdit(column)}
                onEsc={this.cancelEdit} />
            ) : (
              <Input
                value={value.toString()}
                onBlur={this.finishEdit(column)}
                onEnter={this.finishEdit(column)}
                onEsc={this.cancelEdit}
              />
            )
          ) : (dirty) ? value : Row[column]}
        </td>
      ) :
      (<td>-</td>);
  }
}
