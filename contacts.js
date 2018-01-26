const faker = require('faker');

const contactCount = 20;
let contacts = Array.from({ length: contactCount }, (val, i) => ({
  id: i + 1,
  name: faker.name.findName(),
  phone: faker.phone.phoneNumber(),
  photo: faker.image.avatar(),
}));

function all({ page = 1, limit = 9 } = {}) {
  const begin = (page * limit) - limit;
  const end = begin + limit;
  const total = contacts.length;
  const result = contacts.slice(begin, end);

  const hasNextContact = contacts.slice(end, end + 1).length;

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
};