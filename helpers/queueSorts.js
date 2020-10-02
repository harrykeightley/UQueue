// sort by questions asked and then date
export const defaultSort = (a, b) => {
    if (a.questionsAsked < b.questionsAsked) {
        return -1
    } else if (a.questionsAsked > b.questionsAsked) {
        return 1
    }
    let date1 = new Date(a.date)
    let date2 = new Date(b.date)

    if (date1 < date2) {
        return -1
    } else if (date2 > date1) {
        return 1
    }
    return 0
}
