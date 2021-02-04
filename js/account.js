$("#logout-button").click(function (e) {
    localStorage.removeItem('accountLoggedIn');
    window.location.href = 'index.html';
});

$(document).ready(function () {
    // Check if user is logged in
    const value = localStorage.getItem('accountLoggedIn')

    if (value != null) {
        $('#account-name').html(value);
    }
});