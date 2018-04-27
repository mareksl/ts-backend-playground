import hbs from 'hbs';
import moment from 'moment';

hbs.registerHelper('date', timestamp => moment(timestamp).format('DD.MM.YYYY'));
hbs.registerHelper('equal', function(
  this: any,
  lvalue: string,
  rvalue: string,
  options
) {
  if (arguments.length < 3)
    throw new Error('Handlebars Helper equal needs 2 parameters');
  if (lvalue !== rvalue) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});
hbs.registerHelper('fullName', function(person) {
  const lastName = person.lastName ? ` ${person.lastName}` : '';
  return `${person.firstName}${lastName}`;
});
