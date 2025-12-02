import { faker } from '@faker-js/faker';

const DEPARTMENTS = ['IT', 'QA', 'BA', 'HR', 'Design', 'DevOps'];
const SKILLS = ['Java', 'C#', '.NET', 'SQL', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Go', 'AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes', 'Docker', 'Figma', 'Sketch', 'Adobe XD'];
const ROLES = ['Admin', 'RA', 'Manager', 'Viewer'];
const STATUSES = ['Active', 'Inactive'];
const RESOURCE_STATUSES = ['Available', 'Assigned', 'On Hold'];
const ACTIONS = ['CREATE', 'UPDATE', 'DELETE', 'CV_UPLOAD', 'LOGIN', 'LOGOUT', 'EXPORT'];

const createRandomUser = () => ({
  id: faker.string.uuid(),
  username: faker.internet.userName().toLowerCase(),
  email: faker.internet.email(),
  role: faker.helpers.arrayElement(ROLES),
  status: faker.helpers.arrayElement(STATUSES),
});

const createRandomResource = () => {
  const idleFrom = faker.date.past({ years: 1 });
  const isUrgent = (new Date() - idleFrom) / (1000 * 60 * 60 * 24 * 30) >= 2;
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    department: faker.helpers.arrayElement(DEPARTMENTS),
    skills: faker.helpers.arrayElements(SKILLS, faker.number.int({ min: 2, max: 5 })).join(', '),
    idleFrom: idleFrom.toLocaleDateString('en-CA'),
    rate: faker.helpers.arrayElement([400, 500, 550, 600, 700]),
    status: faker.helpers.arrayElement(RESOURCE_STATUSES),
    isUrgent,
    employeeCode: `FJP${faker.number.int({ min: 1000, max: 9999 })}`,
    jobTitle: faker.person.jobTitle(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    experience: `${faker.number.int({ min: 2, max: 10 })} years`,
    cv: 'sample_cv.pdf',
  };
};

const createRandomHistory = (users, resources) => ({
    id: faker.string.uuid(),
    dateTime: faker.date.recent({ days: 30 }).toISOString(),
    user: faker.helpers.arrayElement(users).username,
    action: faker.helpers.arrayElement(ACTIONS),
    resource: faker.helpers.arrayElement(resources).name,
    changes: `Status: Idle -> Assigned`,
});

export const USERS = faker.helpers.multiple(createRandomUser, { count: 25 });
export const RESOURCES = faker.helpers.multiple(createRandomResource, { count: 125 });
export const HISTORY = faker.helpers.multiple(() => createRandomHistory(USERS, RESOURCES), { count: 200 });
