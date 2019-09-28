import * as React from 'react';

interface Props {
  type?: string;
  value: string;
  onBlur?: (currentValue: string) => void;
  onEnter?: (currentValue: string) => void;
  onEsc?: () => void;
}

interface DefaultProps {
  type: string,
}

interface State {
  value: string;
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
    this.setState({ value: event.target.value }); // TODO... again
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
        value={value}></input>
    );
  }
}
