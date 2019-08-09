import * as React from 'react';

import { THead } from './THead';
import { TBody } from './TBody';

import { Field, Row, Info } from 'arca-redux'

interface Props {
  Info?: Info;
  Rows: Row[];
  Requests?: string[];
  onInsert?: (Row: Row, column?: keyof Row, Field?: Field) => string;
  onDelete?: (Row: Row) => void;
  onUpdate?: (Row: Row, column?: keyof Row, Field?: Field) => void;
  provideEmptyRow?: () => Row;
}

interface State {
  newRow?: Row
  insertID?: string;
}

export class Table
  extends React.Component<Props, State>
{
  public state: State = {}

  private startInsert = (): void => {
    !this.state.newRow &&
    this.props.provideEmptyRow &&
    this.setState({
      newRow: this.props.provideEmptyRow()
    });
  }

  public componentDidUpdate(prevProps: Props): void {
    prevProps.Requests !== this.props.Requests &&
    prevProps.Requests &&
    prevProps.Requests.find((id: string): boolean =>
      id === this.state.insertID) &&
    this.setState({
      newRow: undefined,
      insertID: undefined,
    });
  }

  private insert = (Row: Row, column?: keyof Row, Field?: Field): void => {
    const { onInsert } = this.props;
    if (onInsert) {
      this.setState((state: State): State => {
        return {
          ...state,
          insertID: onInsert(Row, column, Field)
        }
      });
    }
  }

  private onDeleteNewRow = (): void => {
    this.setState({
      newRow: undefined,
      insertID: undefined,
    });
  }

  public render(): JSX.Element {
    const { Info, Rows, onInsert, onDelete, onUpdate } = this.props;
    const { newRow } = this.state;
    if (!Info) {
      return (<div>No Info</div>);
    }
    return (
      <table>
        {
          this.props.provideEmptyRow &&
          (<caption>
            <button onClick={this.startInsert}>+</button>
          </caption>)
        }
        <THead Info={Info} />
        <TBody
          Info={Info}
          Rows={Rows}
          onUpdate={onUpdate}
          onInsert={onInsert && this.insert}
          onDelete={onDelete}
          newRow={newRow}
          onDeleteNewRow={this.onDeleteNewRow} />
      </table>
    );
  }
}
