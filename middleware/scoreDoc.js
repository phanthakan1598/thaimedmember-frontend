export default function ({ store, redirect }) {
  if (store.state.scoreData === undefined) {
    return redirect('/score/request')
  }
}
