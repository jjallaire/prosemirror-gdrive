

export class Command {

  constructor(name, icon, title) {
    this.name = name;
    this.icon = icon;
    this.title = title;
  }

  // eslint-disable-next-line
  isEnabled(state) {
    throw new Error('Commands must implement isEnabled');
  }

  // eslint-disable-next-line
  isLatched(state) {
    return false;
  }

  // eslint-disable-next-line
  execute(state, dispatch, view) {
    throw new Error('Commands must implement execute');
  }
}

