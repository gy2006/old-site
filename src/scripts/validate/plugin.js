import $ from 'jquery';

const isArray = Array.isArray || function (value) {
  return toString.call(value) === '[object Array]';
}

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
    if (alias) {
      const $alias = $(alias)
      this._clear($alias);
      if (isArray(text)) {
        const max = text.length - 1;
        text.map((t, index)=>{
          const span = $('<span></span>');
          span.text(t);
          $alias.append(span);
          if (index !== max) {
            $alias.append('<br/>');
          }
        });
      } else {
        $alias.text(text);
      }
      $alias.show();
    }
  }

  _clear (element) {
    $(element).html('').hide();
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