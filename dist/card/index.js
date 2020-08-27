Component({
  externalClasses: ['i-class'],

  options: {
    multipleSlots: true
  },
  handleClick() {

  },
  properties: {

    full: {
      type: Boolean,
      value: false
    },
    thumb: {
      type: String,
      value: ''
    },
    urgent: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    extra: {
      type: String,
      value: ''
    },
    condition: {
      type: String,
      value: ''
    },
  }
});