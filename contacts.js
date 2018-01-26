const faker = require('faker');

const contactCount = 20;

const generateContacts = () => Array.from({ length: contactCount }, (val, i) => ({
  id: i + 1,
  name: faker.name.findName(),
  phone: faker.phone.phoneNumber(),
  photo: faker.image.avatar(),
}));

let contacts = generateContacts();

function all({ page = 1, limit = 9 } = {}) {
  const begin = (page * limit) - limit;
  const end = begin + limit;
  const rows = contacts.slice().reverse();

  const total = rows.length;
  const result = rows.slice(begin, end);

  const hasNextContact = rows.slice(end, end + 1).length;

  const nextPage = hasNextContact ? page + 1 : null;
  const prevPage = page - 1 === 0 ? null : page - 1;

  return {
    page,
    limit,
    total,
    result,
    nextPage,
    prevPage,
  };
};

function add(data) {
  const lastContact = contacts[contacts.length - 1];
  const nextId = lastContact ? lastContact.id + 1 : 1;

  const newContact = { id: nextId, ...data, photo: faker.image.avatar() };

  contacts = contacts.concat(newContact);

  return newContact;
}

function find(id) {
  const contact = contacts.find(contact => contact.id === id);

  if (!contact) {
    const error = new Error(`Contact with id of ${id} was not found.`);
    error.code = 404;

    throw error;
  }

  return contact;
}

function update(id, data) {
  contacts = contacts.map((contact) => {
    if (contact.id === id) {
      return { ...contact, ...data };
    }

    return contact;
  });

  return find(id);
}

function remove(id) {
  find(id);

  contacts = contacts.filter(contact => contact.id !== id);
}

module.exports = {
  all,
  find,
  update,
  remove,
  add,
};
