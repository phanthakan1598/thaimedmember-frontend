export default function ({ store, redirect }) {
  if (store.state.customerIncreaseScore === undefined) {
    return redirect('/increaseScore/request')
  }
}
