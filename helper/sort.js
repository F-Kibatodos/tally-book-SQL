module.exports = (sortKey, sortValue, displaySort) => {
  if (sortKey === 'date' && sortValue === 'DESC')
    return (displaySort = '日期(新到舊)')
  else if (sortKey === 'date' && sortValue === 'ASC')
    return (displaySort = '日期(舊到新)')
  else if (sortKey === 'amount' && sortValue === 'DESC')
    return (displaySort = '花費(多到少)')
  else if (sortKey === 'amount' && sortValue === 'ASC')
    return (displaySort = '花費(少到多)')
}
