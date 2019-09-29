import * as React from 'react';

import { Input } from './Input';
import { Search } from './Search';

import { Row, Field, Fields, SearchMethod } from 'arca-redux/';

import './TCell.less';
import { bool } from 'prop-types';

interface Props {
  Field: Field;
  Row: Row;
  onEdit?: (Row: Row, column?: keyof Fields, Field?: Field) => void;
  search?: SearchMethod;
}

interface State {
  edit: boolean;
  dirty: boolean;
  value: string | number | boolean;
  column?: keyof Fields;
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
    const columns = Object.keys(Row) as (keyof Fields)[];
    const column = columns.find((column): boolean =>
      column === Field.Name
    );
    if (column) {
      const row = Row as Fields;
      const value = row[column];
      if (Field.Type.toLowerCase() == 'checkbox') {
        this.state.value = Boolean(value);
      } else {
        this.state.value = value ? value.toString() : '';
      }
      this.state.column = column;
    }
  }

  public componentDidUpdate(prevProps: Props): void {
    const { props, props: { Field: { Type } }, state } = this;
    if (state.column && prevProps.Row !== props.Row) {
      const row = props.Row as Fields;
      const value = row[state.column];
      this.setState((state: State): State => {
        return {
          ...state,
          value: Type.toLowerCase() == 'checkbox' ?
            Boolean(value) : (value ? value.toString() : ''),
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

  private finishEdit = (column: keyof Fields):
    (currentValue: string | number | boolean) => void =>
    (currentValue: string | number | boolean): void => {
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

  private onChangeCheckbox = (column: keyof Fields): () => void => {
    return (): void => {
      const { Field, Row } = this.props;
      if (!Field.Editable) return;
      this.setState((state: State): State => {
        const currentValue = !state.value;
        if (this.props.onEdit) {
          const newRow = {
            ...Row,
            [column]: currentValue,
          };
          this.props.onEdit(newRow, column, Field);
        }
        return {
          ...state,
          value: currentValue,
          edit: false,
          dirty: true,
        }
      })
    }
  }

  public render(): JSX.Element {
    const { Field, Row, search } = this.props;
    const row = Row as Fields;
    const { Combobox } = Field;
    const { value, column, dirty } = this.state;
    const className = `${Field.Primary ? 'primary' : ''} ${dirty ? 'dirty' : ''}`.trim();
    if (column && Field.Type.toLowerCase() == 'checkbox') {
      return (
        <td>
          <input
            type={Field.Type}
            checked={!!value}
            onChange={this.onChangeCheckbox(column)} />
        </td>
      );
    }
    return (column) ?
      (
        <td
          className={className ? className : undefined}
          onClick={this.startEdit}>
          {(this.state.edit) ? (
            (search && Combobox) ? (
              <Search
                search={search}
                Row={Row}
                Setup={Combobox}
                value={value.toString()}
                onBlur={this.finishEdit(column)}
                onEnter={this.finishEdit(column)}
                onEsc={this.cancelEdit} />
            ) : (
              <Input
                type={Field.Type}
                value={value.toString()}
                onBlur={this.finishEdit(column)}
                onEnter={this.finishEdit(column)}
                onEsc={this.cancelEdit}
              />
            )
          ) : (dirty) ? value : row[column]}
        </td>
      ) :
      (<td>-</td>);
  }
}
