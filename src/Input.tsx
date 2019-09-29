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
    type: 'Text',
  }

  public constructor(props: Props) {
    super(props);
    this.state.value = this.props.value;
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
