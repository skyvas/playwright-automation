import { test, expect } from '../fixtures/baseTest';
import { ORBIT_USERS, ORBIT_PROJECTS } from '../../utils/testData';

test.describe('Orbit Projects Regression Suite @regression', () => {
  test.beforeEach(async ({ loginPage, workspacePage }) => {
    await loginPage.goto();
    await loginPage.login(ORBIT_USERS.admin.username, ORBIT_USERS.admin.password);
    await workspacePage.expectWorkspaceLoaded();
  });

  test('TC-9: Create project with required fields becomes selectable', async ({ projectModal, workspacePage }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-9' },
      { type: 'TMS_Suite', description: 'Projects' },
      { type: 'Priority', description: 'Critical' }
    );

    const testKey = `PRJ${Date.now().toString().slice(-4)}`;
    const testName = `Project ${testKey}`;

    await test.step('Open Create Project modal', async () => {
      await projectModal.openCreateProject();
    });

    await test.step('Fill project key, name, and description', async () => {
      await projectModal.fillProject(testKey, testName, 'Automated test project');
    });

    await test.step('Submit Create Project', async () => {
      await projectModal.submitProject();
      await expect(projectModal.createProjectModal).toBeHidden();
    });

    await test.step('Verify project is selectable in project dropdown', async () => {
      await expect(workspacePage.projectSelect).toContainText(testName);
    });
  });

  test('TC-10: Project creation blocks missing project key', async ({ projectModal }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-10' },
      { type: 'TMS_Suite', description: 'Projects' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Open Create Project and provide only project name', async () => {
      await projectModal.openCreateProject();
      await projectModal.fillProject('', 'Keyless Project');
      await projectModal.submitProject();
    });

    await test.step('Verify project key validity fails and modal remains open', async () => {
      const isValid = await projectModal.projectKeyInput.evaluate((el: HTMLInputElement) => el.checkValidity());
      expect(isValid).toBe(false);
      await expect(projectModal.createProjectModal).toBeVisible();
      await projectModal.cancelProject();
    });
  });

  test('TC-11: Project creation blocks missing project name', async ({ projectModal }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-11' },
      { type: 'TMS_Suite', description: 'Projects' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Open Create Project and provide only project key', async () => {
      await projectModal.openCreateProject();
      await projectModal.fillProject('NONAME', '');
      await projectModal.submitProject();
    });

    await test.step('Verify project name validity fails and modal remains open', async () => {
      const isValid = await projectModal.projectNameInput.evaluate((el: HTMLInputElement) => el.checkValidity());
      expect(isValid).toBe(false);
      await expect(projectModal.createProjectModal).toBeVisible();
      await projectModal.cancelProject();
    });
  });

  test('TC-12: Default Kanban workflow is provisioned for a new project', async ({ projectModal }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-12' },
      { type: 'TMS_Suite', description: 'Projects' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Open Create Project modal and inspect default columns', async () => {
      await projectModal.openCreateProject();
      const defaultColumns = projectModal.createProjectModal.locator('.column-builder-item');
      await expect(defaultColumns).toHaveCount(5);
      await projectModal.cancelProject();
    });
  });

  test('TC-13: Add a custom Kanban column', async ({ projectModal, page }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-13' },
      { type: 'TMS_Suite', description: 'Projects' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Open Configure Kanban Columns modal', async () => {
      await projectModal.openConfigureColumns();
    });

    const stageName = `QA Review ${Date.now().toString().slice(-3)}`;
    await test.step('Add custom stage and save', async () => {
      await projectModal.addExistingStage(stageName);
      await expect(page.locator('.kanban-column')).toContainText([stageName]);
    });

    await test.step('Clean up custom stage to preserve standard columns', async () => {
      await projectModal.openConfigureColumns();
      const deleteButtons = page.locator('#existing-board-columns-list .btn-del-col');
      const count = await deleteButtons.count();
      if (count > 5) {
        await deleteButtons.last().click();
        await projectModal.saveColumnsBtn.click();
        await expect(projectModal.configureColumnsModal).toBeHidden();
      } else {
        await projectModal.cancelColumnsBtn.click();
      }
    });
  });

  test('TC-14: Configure Kanban column order and titles', async ({ projectModal }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-14' },
      { type: 'TMS_Suite', description: 'Projects' },
      { type: 'Priority', description: 'Medium' }
    );

    await test.step('Open Configure Kanban Columns modal', async () => {
      await projectModal.openConfigureColumns();
      await expect(projectModal.columnsList).toBeVisible();
      await projectModal.cancelColumnsBtn.click();
      await expect(projectModal.configureColumnsModal).toBeHidden();
    });
  });

  test('TC-15: Cancel project creation does not create a project', async ({ projectModal, workspacePage }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-15' },
      { type: 'TMS_Suite', description: 'Projects' },
      { type: 'Priority', description: 'Medium' }
    );

    const cancelledName = `Cancelled Project ${Date.now()}`;

    await test.step('Open Create Project and enter data', async () => {
      await projectModal.openCreateProject();
      await projectModal.fillProject('CANC', cancelledName);
    });

    await test.step('Select Cancel and verify project was not added', async () => {
      await projectModal.cancelProject();
      await expect(workspacePage.projectSelect).not.toContainText(cancelledName);
    });
  });

  test('TC-16: Project selector switches the active project context', async ({ workspacePage, page }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-16' },
      { type: 'TMS_Suite', description: 'Projects' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Switch between projects', async () => {
      await workspacePage.selectProject(ORBIT_PROJECTS.mobile.id);
      await expect(workspacePage.projectSelect).toHaveValue(ORBIT_PROJECTS.mobile.id);

      await workspacePage.selectProject(ORBIT_PROJECTS.core.id);
      await expect(workspacePage.projectSelect).toHaveValue(ORBIT_PROJECTS.core.id);
    });
  });
});
