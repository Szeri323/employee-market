export { clearInputField, clearWitheSpacesInData }

function clearInputField(element) {
    element.value = ""
}

function clearWitheSpacesInData(data) {
    data = data.trim()
    return data
}