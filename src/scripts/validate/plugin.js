import $ from 'jquery';

export default class AliasPlugin {

  constructor (fields = []) {
    this.aliases = fields.reduce((prev, field) => {
      prev[field.name] = field.errorElement;
      return prev;
    }, {});
    return this;
  }

  getAlias (name) {
    const alias = this.aliases[name];
    if (!alias) {
      console.warn('not set alias', name);
      return;
    }
    return alias;
  }

  setTexts (objs) {
    for (let name in objs) {
      const text = objs[name];
      this.setText(name, text);
    }
  }

  setText (name, text) {
    const alias = this.getAlias(name);
    alias && $(alias).text(text).show();
  }

  _clear (element) {
    $(element).text('').hide();
  }

  _clearAll () {
    const aliases = this.aliases
    for (let name in aliases) {
      const alias = aliases[name];
      this._clear(alias);
    }
  }

  clear (name) {
    if (!name) {
      this._clearAll();
    } else {
      const alias = this.getAlias(name);
      alias && this._clear(alias);
    }
  }
}