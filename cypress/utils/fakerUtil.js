import faker from 'faker';

/**
 * Produces a mock email formatted <random_username><random_four_digit_number>@<random_domain>
 * @returns {string}
 */
const getTestEmailString = (emailDomains = ['mailinator.com', 'yopmail.com']) => {
  // Pick one of the domains randomly
  const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];

  // Generate fake user name and four-digit number and prepend @ <domain>
  return `${faker.internet.userName()}${faker.random.number(1111, 9999)}@${domain}`;
};

export { getTestEmailString };
