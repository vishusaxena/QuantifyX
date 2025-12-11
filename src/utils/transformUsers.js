const transformUsers = (usersArray) => {
  return {
    Data: usersArray.map((u, i) => ({
      _id: u._id,
      email: u.email,
      username: u.username,
      firstname: u.firstname,
      lastname: u.lastname,
      phone: u.phone,
      city: u.city,
      street: u.street,
      zipcode: u.zipcode,
    })),
    HideColumns: ["_id"],
    Actions: ["Edit", "Delete"],
  };
};

export default transformUsers;
