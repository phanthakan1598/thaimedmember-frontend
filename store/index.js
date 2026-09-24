export const state = () => {
  return {
    user: null,
    statusEligible: undefined,
    customerData: undefined,
    scoreData: undefined,
    requestTableState: undefined,
    round: null,
    filterData: null,
    popup: null,
    waitPagePagination: {
      currentPage: 1,
      itemsPerPage: 10
    },
    customerIncreaseScore: null,
    date: {
      register: {
        on: '7 มีนาคม 2568',
        off: '28 มีนาคม 2568'
      },
      pay: {
        on: '7 มีนาคม 2568',
        off: '29 มีนาคม 2568',
        checkPay: '7 - 29 มีนาคม 2568'
      },
      app: '2 ม.ค. 2568',
      location: '2 ม.ค. 2568',
      doc: '2 - 30 ม.ค. 2568'
    },
    time: {
      register: {
        on: '2025-03-07 00:00:01',
        off: '2025-12-31 23:59:59'
      },
      pay: {
        on: '2025-03-07 00:00:01',
        off: '2025-03-29 22:00:00'
      },
      examLocation: {
        on: '2025-11-20 08:30:00',
        off: '2026-12-31 23:59:59'
      },
      score: {
        on: '2026-02-27 08:30:00',
        off: '2026-12-31 23:59:59'
      },
      request: {
        on: '2029-02-26 10:00:00',
        off: '2026-12-31 23:59:59'
      },
      checkStatusRegister: {
        on: '2025-01-02 00:00:01',
        off: '2025-01-10 23:59:59'
      },
      editDoc: {
        on: '2024-01-02 00:00:01',
        off: '2025-11-29 22:00:00'
      },
      howto: {
        on: '2025-02-07 00:00:01',
        off: '2025-03-28 16:30:00'
      },
      statusDoc: {
        on: '2025-11-07 00:00:01',
        off: '2025-11-28 00:00:01'
      },
      exam: {
        on: '2025-11-07 00:00:01',
        off: '2025-11-28 00:00:01'
      },
      appForm: {
        on: '2025-12-25 16:00:00',
        off: '2026-12-31 23:59:59'
      }
    }
  }
}

export const mutations = {
  setUser (state, data) {
    state.user = data
  },
  setStatusEligible (state, data) {
    state.statusEligible = data
  },
  setCustomerData (state, data) {
    state.customerData = data
  },
  logout (state) {
    state.user = null
    state.customerData = undefined
    state.statusEligible = undefined
  },
  setScoreData (state, data) {
    state.scoreData = data
  },
  setRound (state, data) {
    state.round = data
  },
  setFilterData (state, data) {
    state.filterData = data
  },
  setPopup (state, data) {
    state.popup = data
  },
  setWaitPagePagination (state, data) {
    state.waitPagePagination = data
  },
  setCustomerIncreaseScore (state, data) {
    state.customerIncreaseScore = data
  },
  PostRequestTableState (state, data) {
    state.requestTableState = data
  }

}
