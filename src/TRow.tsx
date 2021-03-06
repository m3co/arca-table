import * as React from 'react';

import { TCell } from './TCell';

import { Field, Row, Fields, Info, SearchMethod } from 'arca-redux';

import './TRow.less';

interface Props {
  Info: Info;
  Row: Row;
  onEdit?: (Row: Row, column?: keyof Fields, Field?: Field) => void;
  onRemove?: (Row: Row) => void;
  dirty?: boolean;
  search?: SearchMethod;
  isNew?: boolean;
}

interface State {
  dirty: boolean;
  pk?: string;
}

function getPK(Row: Row, Info: Info): string {
  const PKs: string[] = Info.Fields
    .filter((field): boolean => field.Primary)
    .map((field: Field): string => field.Name);
  const columns = Object.keys(Row) as (keyof Fields)[];
  return PKs.map((pk: string): string => {
    const column = columns.find((column): boolean => column === pk);
    if (column) {
      const row = Row as Fields;
      const value = row[column];
      return value ? value.toString() : '';
    }
    return '';
  }).join();
}

export class TRow
  extends React.Component<Props, State>
{
  public state: State = {
    dirty: false,
  }

  public constructor(props: Props) {
    super(props);
    this.state.dirty = !!this.props.dirty;
  }

  public componentDidUpdate(): void {
    const { Row, Info } = this.props;
    const { pk, dirty } = this.state;
    if (pk && dirty) {
      if (pk !== getPK(Row, Info)) {
        this.setState({ dirty: false });
      }
    }
  }

  private remove = (): void => {
    const { onRemove, Row, Info } = this.props;
    const pk = getPK(Row, Info);

    if (onRemove) {
      this.setState({ dirty: true, pk });
      onRemove(Row);
    }
  }

  public render(): JSX.Element {
    const { Info, Row, onEdit, search, isNew } = this.props;
    const { dirty } = this.state;
    const className = dirty ? 'dirty' : undefined;
    return (
      <tr className={className}>
        {
          Info.Fields.map((field, key): JSX.Element =>
            <TCell
              key={key}
              Row={Row}
              Field={field}
              onEdit={onEdit}
              search={search}
              isNew={isNew} />
          )
        }
        <td>
          <button onClick={this.remove}>-</button>
        </td>
      </tr>
    );
  }
}
