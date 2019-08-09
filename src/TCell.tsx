import * as React from 'react';

import { Input } from './Input';

import { Row, Field } from 'arca-redux';
import './TCell.less';

interface Props {
  Field: Field;
  Row: Row;
  onEdit?: (Row: Row, column?: keyof Row, Field?: Field) => void;
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
      this.state.value = Row[column] ? Row[column].toString() : '';
      this.state.column = column;
    }
  }

  public componentDidUpdate(prevProps: Props): void {
    const { props, state } = this;
    if (state.column && prevProps.Row !== props.Row) {
      const value = props.Row[state.column].toString();
      this.setState((state: State): State => {
        return {
          ...state,
          value,
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

  private finishEdit = (column: keyof Row) => (currentValue: string): void => {
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
    const { Field, Row } = this.props;
    const { value, column, dirty } = this.state;
    const className = `${Field.Primary ? 'primary' : ''} ${dirty ? 'dirty' : ''}`.trim();
    return (column) ?
      (
        <td
          className={className ? className : undefined}
          onClick={this.startEdit}>
          {(this.state.edit) ? (
            <Input
              value={value.toString()}
              onBlur={this.finishEdit(column)}
              onEnter={this.finishEdit(column)}
              onEsc={this.cancelEdit}
            />
          ) : (dirty) ? value : Row[column]}
        </td>
      ) :
      (<td>-</td>);
  }
}
