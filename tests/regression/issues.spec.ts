import { test, expect } from '../fixtures/baseTest';
import { ORBIT_USERS } from '../../utils/testData';

test.describe('Orbit Issues Regression Suite @regression', () => {
  test.beforeEach(async ({ loginPage, workspacePage }) => {
    await loginPage.goto();
    await loginPage.login(ORBIT_USERS.admin.username, ORBIT_USERS.admin.password);
    await workspacePage.expectWorkspaceLoaded();
  });

  test('TC-23: Create issue with required title and verify card on board', async ({ workspacePage, issueModal, page }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-23' },
      { type: 'TMS_Suite', description: 'Issues' },
      { type: 'Priority', description: 'Critical' }
    );

    const issueTitle = `Automated Issue ${Date.now().toString().slice(-4)}`;

    await test.step('Open Create Issue modal', async () => {
      await workspacePage.openCreateIssue();
    });

    await test.step('Fill title and submit', async () => {
      await issueModal.createIssue({
        title: issueTitle,
        description: 'Automated description',
        priority: 'HIGH',
        type: 'TASK',
      });
    });

    await test.step('Verify new issue appears on the board', async () => {
      await expect(page.locator('.issue-card')).toContainText([issueTitle]);
    });
  });

  test('TC-24: Issue creation blocks missing title', async ({ workspacePage, issueModal }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-24' },
      { type: 'TMS_Suite', description: 'Issues' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Open Create Issue and submit without title', async () => {
      await workspacePage.openCreateIssue();
      await issueModal.submitIssueBtn.click();
    });

    await test.step('Verify HTML5 required validation on title input', async () => {
      const isValid = await issueModal.issueTitleInput.evaluate((el: HTMLInputElement) => el.checkValidity());
      expect(isValid).toBe(false);
      await issueModal.cancelIssueBtn.click();
      await expect(issueModal.createModal).toBeHidden();
    });
  });

  test('TC-25: Issue accepts Markdown description and persists', async ({ workspacePage, issueModal }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-25' },
      { type: 'TMS_Suite', description: 'Issues' },
      { type: 'Priority', description: 'Medium' }
    );

    const title = `Markdown Issue ${Date.now().toString().slice(-4)}`;
    const mdDesc = '## Acceptance Criteria\n- [x] Item 1\n**Bold text**';

    await test.step('Create issue with markdown description', async () => {
      await workspacePage.openCreateIssue();
      await issueModal.createIssue({
        title,
        description: mdDesc,
      });
    });

    await test.step('Open issue detail and verify markdown description content', async () => {
      const card = workspacePage.page.locator('.issue-card', { hasText: title }).first();
      await card.click();
      await expect(issueModal.detailModal).toBeVisible();
      await expect(issueModal.detailDescInput).toHaveValue(mdDesc);
      await issueModal.closeDetailModal();
    });
  });

  test('TC-26: Issue supports priority, type, status, points, assignee, and tags', async ({ workspacePage, issueModal }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-26' },
      { type: 'TMS_Suite', description: 'Issues' },
      { type: 'Priority', description: 'High' }
    );

    const title = `Multi-field Issue ${Date.now().toString().slice(-4)}`;

    await test.step('Create issue with complete metadata', async () => {
      await workspacePage.openCreateIssue();
      await issueModal.createIssue({
        title,
        description: 'Complete fields test',
        priority: 'CRITICAL',
        type: 'BUG',
        points: 5,
        tags: 'Core, Security',
      });
    });

    await test.step('Open issue card and verify values persist', async () => {
      const card = workspacePage.page.locator('.issue-card', { hasText: title }).first();
      await card.click();
      await expect(issueModal.detailPrioritySelect).toHaveValue('CRITICAL');
      await expect(issueModal.detailPointsInput).toHaveValue('5');
      await issueModal.closeDetailModal();
    });
  });

  test('TC-27: Acceptance checklist items can be added and toggled', async ({ workspacePage, issueModal }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-27' },
      { type: 'TMS_Suite', description: 'Issues' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Open first issue on board', async () => {
      const card = workspacePage.page.locator('.issue-card').first();
      await card.click();
      await expect(issueModal.detailModal).toBeVisible();
    });

    await test.step('Add a new acceptance checklist item', async () => {
      const itemText = `Criterion ${Date.now().toString().slice(-3)}`;
      await issueModal.addChecklistItem(itemText);
      await expect(issueModal.checklistItems).toContainText(itemText);
    });

    await test.step('Toggle checklist checkbox and verify counter updates', async () => {
      await issueModal.toggleChecklistItem(0);
      await expect(issueModal.checklistCounter).toBeVisible();
      await issueModal.closeDetailModal();
    });
  });

  test('TC-28: Issue comments can be posted and appear in stream', async ({ workspacePage, issueModal }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-28' },
      { type: 'TMS_Suite', description: 'Issues' },
      { type: 'Priority', description: 'High' }
    );

    await test.step('Open first issue card', async () => {
      const card = workspacePage.page.locator('.issue-card').first();
      await card.click();
      await expect(issueModal.detailModal).toBeVisible();
    });

    await test.step('Post comment and verify in comment stream', async () => {
      const comment = `Automated review comment ${Date.now()}`;
      await issueModal.postComment(comment);
      await expect(issueModal.commentsStream).toContainText(comment);
      await issueModal.closeDetailModal();
    });
  });

  test('TC-29: Issue attachments upload zone is available', async ({ workspacePage, issueModal }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-29' },
      { type: 'TMS_Suite', description: 'Issues' },
      { type: 'Priority', description: 'Medium' }
    );

    await test.step('Open Create Issue and check file drop zone', async () => {
      await workspacePage.openCreateIssue();
      await expect(workspacePage.page.locator('#file-drop-zone')).toBeVisible();
      await expect(issueModal.issueFileInput).toBeAttached();
      await issueModal.cancelIssueBtn.click();
    });
  });

  test('TC-30: Issue detail modal supports attachment preview', async ({ workspacePage, issueModal }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-30' },
      { type: 'TMS_Suite', description: 'Issues' },
      { type: 'Priority', description: 'Medium' }
    );

    await test.step('Open first issue and check attachments section', async () => {
      const card = workspacePage.page.locator('.issue-card').first();
      await card.click();
      await expect(issueModal.detailAttachmentsGrid).toBeAttached();
      await issueModal.closeDetailModal();
    });
  });

  test('TC-31: Issue changes persist after Save Changes', async ({ workspacePage, issueModal }) => {
    test.info().annotations.push(
      { type: 'TMS_ID', description: 'TC-31' },
      { type: 'TMS_Suite', description: 'Issues' },
      { type: 'Priority', description: 'Critical' }
    );

    const updatedTitle = `Updated Title ${Date.now().toString().slice(-4)}`;

    await test.step('Open first issue on board', async () => {
      const card = workspacePage.page.locator('.issue-card').first();
      await card.click();
      await expect(issueModal.detailModal).toBeVisible();
    });

    await test.step('Edit title and click Save Changes', async () => {
      await issueModal.detailTitleInput.fill(updatedTitle);
      await issueModal.saveChanges();
    });

    await test.step('Close, reopen, and verify saved title persists', async () => {
      await issueModal.closeDetailModal();
      const card = workspacePage.page.locator('.issue-card', { hasText: updatedTitle }).first();
      await card.click();
      await expect(issueModal.detailTitleInput).toHaveValue(updatedTitle);
      await issueModal.closeDetailModal();
    });
  });
});
