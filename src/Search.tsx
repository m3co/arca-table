import * as React from 'react';
import { Combobox, Row, SearchMethod, Params } from 'arca-redux';
import { v4 as uuid4 } from 'uuid';

interface Props {
  Row: Row;
  Setup: Combobox;
  list?: string;
  value: string;
  search: SearchMethod;
  onBlur?: (currentValue: string) => void;
  onEnter?: (currentValue: string) => void;
  onEsc?: () => void;
}

interface RowOption {
  label: string | number;
  value: string | number;
}

interface State {
  Rows: RowOption[];
  value: string;
}

export class Search
  extends React.Component<Props, State>
{
  public static defaultProps = {
    list: uuid4(),
  }

  public state: State = {
    Rows: [],
    value: this.props.value,
  }

  private columns = Object.keys(this.props.Row) as (keyof Row)[];
  private params = Object.keys(this.props.Setup.Params)
    .reduce((acc: Params, key: string): Params => {
      const column = this.columns
        .find((column): boolean => column === this.props.Setup.Params[key]);
      column && (acc[key] = this.props.Row[column]);
      return acc;
    }, {});

  private search(params: Params): void {
    const { Setup, search } = this.props;
    search(Setup.Source, Setup.Value, params)
      .then((response): void => {
        const Rows = response.Result
          .map((result): RowOption => ({
            value: result[Setup.Value] || '',
            label: result[Setup.Display] || '',
          }));
        this.setState((state: State): State => ({
          ...state,
          Rows,
        }));
      });
  }

  public constructor(props: Props) {
    super(props);
    this.search(this.params);
  }

  private onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { state, props: { Setup } } = this;
    this.search({
      ...this.params,
      [Setup.Value]: event.target.value,
    });

    this.setState({
      ...state,
      value: event.target.value,
    });
  }

  private onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    const extra = {
      altKey: !!event.altKey,
      ctrlKey: !!event.ctrlKey,
      metaKey: !!event.metaKey,
      shiftKey: !!event.shiftKey,
    };
    if (extra.altKey || extra.ctrlKey || extra.metaKey || extra.shiftKey) {
      return;
    }
    if (event.key == 'Enter' && this.props.onEnter) {
      this.props.onEnter(this.state.value);
    }
    if (event.key == 'Escape' && this.props.onEsc) {
      this.props.onEsc();
    }
  }

  private onBlur = (): void => {
    if (this.props.onBlur) this.props.onBlur(this.state.value);
  }

  public render(): JSX.Element {
    const { state, props: { list } } = this;
    return (
      <React.Fragment>
        <input
          list={list}
          autoFocus={true}
          onChange={this.onChange}
          onKeyUp={this.onKeyUp}
          onBlur={this.onBlur}
          value={state.value} />
        <datalist id={list}>
          {
            state.Rows.map((row, key): JSX.Element =>
              <option
                key={key}
                label={row.label.toString()}
                value={row.value} />
            )
          }
        </datalist>
      </React.Fragment>
    );
  }
}
