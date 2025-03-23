const users = {};

const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }
  
  response.end();
};

// return user object as JSON
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  respondJSON(request, response, 200, responseJSON);
};

// function to add a user from a POST body
const addUser = (request, response) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  const { name, age } = request.body;

  if (!name || !age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  if (!users[name]) {
    responseCode = 201;
    users[name] = {
      name: name,
    };
  }
  
  users[name].age = age;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    responseJSON.user = users[name];
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSON(request, response, responseCode, {});
};

//The page that's called when the url is not recognized
const notFound = (request, response) => {
    const responseData = {
        message: 'Message: The page you were looking for cannot be found',
      };
        respondJSON(request, response, 404, responseData);
}

// public exports
module.exports = {
  getUsers,
  addUser,
  notFound
};