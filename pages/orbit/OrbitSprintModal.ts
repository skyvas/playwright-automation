import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';

export class OrbitSprintModal extends BasePage {
  readonly sprintMgmtModal: Locator;
  readonly manageSprintsBtn: Locator;
  readonly sprintMgmtCloseBtn: Locator;
  readonly tabActiveSprints: Locator;
  readonly tabCreateSprint: Locator;
  readonly tabHistory: Locator;

  // Create sprint fields
  readonly sprintNameInput: Locator;
  readonly sprintGoalInput: Locator;
  readonly sprintStartDateInput: Locator;
  readonly sprintEndDateInput: Locator;
  readonly submitSprintBtn: Locator;

  // Complete sprint modal
  readonly completeSprintModal: Locator;
  readonly completeSprintNameDisplay: Locator;
  readonly incompleteDestinationSelect: Locator;
  readonly confirmCompleteBtn: Locator;
  readonly bannerStartSprintBtn: Locator;
  readonly bannerCompleteSprintBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.sprintMgmtModal = page.locator('#sprint-mgmt-modal');
    this.manageSprintsBtn = page.locator('#btn-manage-sprints');
    this.sprintMgmtCloseBtn = page.locator('#sprint-mgmt-close');
    this.tabActiveSprints = page.locator('#tab-sprints-active');
    this.tabCreateSprint = page.locator('#tab-sprints-create');
    this.tabHistory = page.locator('#tab-sprints-history');

    this.sprintNameInput = page.locator('#new-sprint-name');
    this.sprintGoalInput = page.locator('#new-sprint-goal');
    this.sprintStartDateInput = page.locator('#new-sprint-start');
    this.sprintEndDateInput = page.locator('#new-sprint-end');
    this.submitSprintBtn = page.locator('#create-sprint-form button[type="submit"]');

    this.completeSprintModal = page.locator('#complete-sprint-modal');
    this.completeSprintNameDisplay = page.locator('#complete-sprint-name-display');
    this.incompleteDestinationSelect = page.locator('#incomplete-issues-destination');
    this.confirmCompleteBtn = page.locator('#btn-confirm-complete-sprint');
    this.bannerStartSprintBtn = page.locator('#btn-banner-start-sprint');
    this.bannerCompleteSprintBtn = page.locator('#btn-banner-complete-sprint');
  }

  async openSprintManagement(): Promise<void> {
    await this.manageSprintsBtn.click();
    await expect(this.sprintMgmtModal).toBeVisible();
  }

  async openPlanNewSprint(): Promise<void> {
    await this.openSprintManagement();
    await this.tabCreateSprint.click();
    await expect(this.sprintNameInput).toBeVisible();
  }

  async fillSprintForm(name?: string, goal?: string, startDate?: string, endDate?: string): Promise<void> {
    if (name !== undefined) await this.sprintNameInput.fill(name);
    if (goal !== undefined) await this.sprintGoalInput.fill(goal);
    if (startDate !== undefined) await this.sprintStartDateInput.fill(startDate);
    if (endDate !== undefined) await this.sprintEndDateInput.fill(endDate);
  }

  async submitSprint(): Promise<void> {
    await this.submitSprintBtn.click();
  }

  async closeSprintManagement(): Promise<void> {
    await this.sprintMgmtCloseBtn.click();
    await expect(this.sprintMgmtModal).toBeHidden();
  }
}
