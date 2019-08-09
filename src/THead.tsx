
import * as React from 'react';

import { Info } from 'arca-redux';
import './THead.less';

interface Props {
  Info: Info;
}

export class THead
  extends React.Component<Props>
{
  public render(): JSX.Element {
    const { Info } = this.props;
    return (
      <thead>
        <tr>
          {
            Info.Fields.map((field, key): JSX.Element =>
              <th key={key} className={field.Primary ? 'primary' : undefined}>{field.Name}</th>
            )
          }
          <th></th>
        </tr>
      </thead>
    );
  }
}
