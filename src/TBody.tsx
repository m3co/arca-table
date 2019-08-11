
import * as React from 'react';

import { TRow } from './TRow';

import { Field, Row, Fields, Info, ARCASearchSocket } from 'arca-redux';

interface Props {
  newRow?: Row;
  onDeleteNewRow?: (Row: Row) => void;
  Info: Info;
  Rows: Row[];
  onUpdate?: (Row: Row, column?: keyof Fields, Field?: Field) => void;
  onInsert?: (Row: Row, column?: keyof Fields, Field?: Field) => void;
  onDelete?: (Row: Row) => void;
}

export class TBody
  extends React.Component<Props>
{
  private socket?: ARCASearchSocket;
  public constructor(props: Props) {
    super(props);

    let shouldOpenSocket = !!props.Info.Fields
      .find((field): boolean => !!field.Combobox);
    if (shouldOpenSocket) {
      this.socket = new ARCASearchSocket();
    }
  }

  public render(): JSX.Element {
    const { Info, Rows, newRow,
      onUpdate, onInsert, onDelete, onDeleteNewRow } = this.props;
    return (
      <tbody>
        {
          newRow &&
          <TRow
            key={'newRow'}
            Info={Info}
            Row={newRow}
            onEdit={onInsert}
            onRemove={onDeleteNewRow}
            dirty={true}
            socket={this.socket} />
        }
        {
          Rows.map((Row, key): JSX.Element => {
            return (<TRow
              key={key}
              Info={Info}
              Row={Row}
              onEdit={onUpdate}
              onRemove={onDelete}
              socket={this.socket} />);
          })
        }
      </tbody>
    );
  }
}
