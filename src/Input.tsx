import * as React from 'react';

interface Props {
  type?: string;
  value: string | number | boolean;
  onBlur?: (currentValue: string | number | boolean) => void;
  onEnter?: (currentValue: string | number | boolean) => void;
  onEsc?: () => void;
}

interface DefaultProps {
  type: string,
}

interface State {
  value: string | number | boolean;
}

export class Input
  extends React.Component<Props>
{
  public state: State = {
    value: '',
  }

  public static defaultProps: DefaultProps = {
    type: 'text',
  }

  public constructor(props: Props) {
    super(props)
    this.state.value = this.props.value;
    if (this.props.type?.toLowerCase() === 'date') {
      this.state.value = this.props.value ?
        this.toDate(this.dateToArray(new Date(this.props.value.toString()))) :
        '';
    }
    if (this.props.type?.toLowerCase() === 'datetime-local') {
      this.state.value = this.props.value ?
        this.toDateTime(this.dateToArray(new Date(this.props.value.toString()))) :
        '';
    }
  }

  private dateToArray(d: Date) {
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).match(/(\d+)/g)
  }

  private toDate(d: RegExpMatchArray | null) {
    return d === null ? '' : `${d[2]}-${d[0]}-${d[1]}`;
  }

  private toDateTime(d: RegExpMatchArray | null) {
    return d === null ? '' : `${d[2]}-${d[0]}-${d[1]}T${d[3]}:${d[4]}:${d[5]}`;
  }

  private onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { type } = this.props;
    if (type) {
      switch (type.toLowerCase()) {
        case 'number':
          return this.setState({ value: Number(event.target.value) });
        case 'checkbox':
          return this.setState({ value: Boolean(event.target.checked) });
        default:
          break;
      }
    }
    this.setState({ value: event.target.value });
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
    const { value } = this.state;
    const { type } = this.props;
    return (
      <input
        type={type}
        autoFocus={true}
        onChange={this.onChange}
        onKeyUp={this.onKeyUp}
        onBlur={this.onBlur}
        value={value.toString()}></input>
    );
  }
}
