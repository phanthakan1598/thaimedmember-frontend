import { Loading } from 'notiflix'

const Notiflix = {

  loading () {
    Loading.circle({
      svgColor: '#216DA6',
      messageFontSize: '20px'
    })
  },

  remove () {
    Loading.remove()
  }

}
const loadStart = function () {
  return Loading.circle('loading...')
}
const loadEnd = function () {
  return Loading.remove()
}

export default ({ app }, inject) => {
  inject('Notiflix', Notiflix)
  inject('loadStart', loadStart)
  inject('loadEnd', loadEnd)
}
