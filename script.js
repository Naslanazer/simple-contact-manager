const contactForm = document.getElementById("contactForm");
const contactTable = document.getElementById("contactTable");
const searchInput = document.getElementById("search");

const contactId = document.getElementById("contactId");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");

const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

let contacts = [];


// Load contacts when page opens
loadContacts();


// Get contacts from PHP
function loadContacts() {

    fetch("get_contacts.php")
        .then(response => response.json())
        .then(data => {

            contacts = data;

            displayContacts(contacts);

        })
        .catch(error => {
            console.error("Error:", error);
            alert("Unable to load contacts.");
        });
}


// Display contacts
function displayContacts(data) {

    contactTable.innerHTML = "";

    if (data.length === 0) {

        contactTable.innerHTML = `
            <tr>
                <td colspan="5">No contacts found.</td>
            </tr>
        `;

        return;
    }

    data.forEach(contact => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(contact.name)}</td>
            <td>${escapeHTML(contact.email || "")}</td>
            <td>${escapeHTML(contact.phone || "")}</td>
            <td>${escapeHTML(contact.address || "")}</td>

            <td>
                <button
                    class="edit-btn"
                    onclick="editContact(${contact.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteContact(${contact.id})">
                    Delete
                </button>
            </td>
        `;

        contactTable.appendChild(row);
    });
}


// Add or update contact
contactForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const id = contactId.value;

    const formData = new FormData();

    formData.append("name", nameInput.value);
    formData.append("email", emailInput.value);
    formData.append("phone", phoneInput.value);
    formData.append("address", addressInput.value);

    let url;

    if (id) {

        formData.append("id", id);
        url = "update_contact.php";

    } else {

        url = "add_contact.php";

    }

    fetch(url, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {

        if (data.success) {

            alert(data.message);

            resetForm();
            loadContacts();

        } else {

            alert(data.message);

        }

    })
    .catch(error => {

        console.error("Error:", error);
        alert("Something went wrong.");

    });

});


// Edit contact
function editContact(id) {

    const contact = contacts.find(c => c.id == id);

    if (!contact) {
        return;
    }

    contactId.value = contact.id;
    nameInput.value = contact.name;
    emailInput.value = contact.email || "";
    phoneInput.value = contact.phone || "";
    addressInput.value = contact.address || "";

    formTitle.textContent = "Edit Contact";
    submitBtn.textContent = "Update Contact";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Delete contact
function deleteContact(id) {

    if (!confirm("Are you sure you want to delete this contact?")) {
        return;
    }

    const formData = new FormData();

    formData.append("id", id);

    fetch("delete_contact.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {

        if (data.success) {

            alert(data.message);
            loadContacts();

        } else {

            alert(data.message);

        }

    })
    .catch(error => {

        console.error("Error:", error);
        alert("Something went wrong.");

    });
}


// Search contacts
searchInput.addEventListener("input", function() {

    const searchText = searchInput.value.toLowerCase();

    const filteredContacts = contacts.filter(contact => {

        return (
            contact.name.toLowerCase().includes(searchText) ||
            (contact.email || "").toLowerCase().includes(searchText) ||
            (contact.phone || "").toLowerCase().includes(searchText) ||
            (contact.address || "").toLowerCase().includes(searchText)
        );

    });

    displayContacts(filteredContacts);
});


// Reset form
cancelBtn.addEventListener("click", resetForm);

function resetForm() {

    contactForm.reset();

    contactId.value = "";

    formTitle.textContent = "Add Contact";
    submitBtn.textContent = "Add Contact";
}


// Prevent HTML injection when displaying data
function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}