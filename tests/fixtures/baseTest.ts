import { test as baseTest, expect } from '@playwright/test';
import { OrbitLoginPage } from '../../pages/orbit/OrbitLoginPage';
import { OrbitWorkspacePage } from '../../pages/orbit/OrbitWorkspacePage';
import { OrbitProjectModal } from '../../pages/orbit/OrbitProjectModal';
import { OrbitSprintModal } from '../../pages/orbit/OrbitSprintModal';
import { OrbitIssueModal } from '../../pages/orbit/OrbitIssueModal';
import { OrbitUserModal } from '../../pages/orbit/OrbitUserModal';

export type OrbitTestFixtures = {
  loginPage: OrbitLoginPage;
  workspacePage: OrbitWorkspacePage;
  projectModal: OrbitProjectModal;
  sprintModal: OrbitSprintModal;
  issueModal: OrbitIssueModal;
  userModal: OrbitUserModal;
};

export const test = baseTest.extend<OrbitTestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new OrbitLoginPage(page);
    await use(loginPage);
  },
  workspacePage: async ({ page }, use) => {
    const workspacePage = new OrbitWorkspacePage(page);
    await use(workspacePage);
  },
  projectModal: async ({ page }, use) => {
    const projectModal = new OrbitProjectModal(page);
    await use(projectModal);
  },
  sprintModal: async ({ page }, use) => {
    const sprintModal = new OrbitSprintModal(page);
    await use(sprintModal);
  },
  issueModal: async ({ page }, use) => {
    const issueModal = new OrbitIssueModal(page);
    await use(issueModal);
  },
  userModal: async ({ page }, use) => {
    const userModal = new OrbitUserModal(page);
    await use(userModal);
  },
});

export { expect };
