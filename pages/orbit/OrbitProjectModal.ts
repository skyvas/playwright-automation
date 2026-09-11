import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';

export class OrbitProjectModal extends BasePage {
  // Create Project
  readonly createProjectModal: Locator;
  readonly newProjectBtn: Locator;
  readonly projectKeyInput: Locator;
  readonly projectNameInput: Locator;
  readonly projectDescInput: Locator;
  readonly customColumnInput: Locator;
  readonly addCustomColumnBtn: Locator;
  readonly submitProjectBtn: Locator;
  readonly cancelProjectBtn: Locator;
  readonly projectCloseBtn: Locator;

  // Configure Board Columns
  readonly configureColumnsModal: Locator;
  readonly manageColumnsBtn: Locator;
  readonly existingColNameInput: Locator;
  readonly addExistingColBtn: Locator;
  readonly saveColumnsBtn: Locator;
  readonly cancelColumnsBtn: Locator;
  readonly columnsModalCloseBtn: Locator;
  readonly columnsList: Locator;

  constructor(page: Page) {
    super(page);
    this.createProjectModal = page.locator('#create-project-modal');
    this.newProjectBtn = page.locator('#btn-new-project');
    this.projectKeyInput = page.locator('#new-proj-key');
    this.projectNameInput = page.locator('#new-proj-name');
    this.projectDescInput = page.locator('#new-proj-desc');
    this.customColumnInput = page.locator('#new-col-name-input');
    this.addCustomColumnBtn = page.locator('#btn-add-custom-column');
    this.submitProjectBtn = page.locator('#create-project-form button[type="submit"]');
    this.cancelProjectBtn = page.locator('#btn-cancel-project');
    this.projectCloseBtn = page.locator('#project-modal-close');

    this.configureColumnsModal = page.locator('#configure-columns-modal');
    this.manageColumnsBtn = page.locator('#btn-manage-columns');
    this.existingColNameInput = page.locator('#existing-col-name-input');
    this.addExistingColBtn = page.locator('#btn-add-existing-column');
    this.saveColumnsBtn = page.locator('#btn-save-columns');
    this.cancelColumnsBtn = page.locator('#btn-cancel-columns');
    this.columnsModalCloseBtn = page.locator('#columns-modal-close');
    this.columnsList = page.locator('#existing-board-columns-list');
  }

  async openCreateProject(): Promise<void> {
    await this.newProjectBtn.click();
    await expect(this.createProjectModal).toBeVisible();
  }

  async fillProject(key?: string, name?: string, desc?: string): Promise<void> {
    if (key !== undefined) await this.projectKeyInput.fill(key);
    if (name !== undefined) await this.projectNameInput.fill(name);
    if (desc !== undefined) await this.projectDescInput.fill(desc);
  }

  async addCustomColumn(columnName: string): Promise<void> {
    await this.customColumnInput.fill(columnName);
    await this.addCustomColumnBtn.click();
  }

  async submitProject(): Promise<void> {
    await this.submitProjectBtn.click();
  }

  async cancelProject(): Promise<void> {
    await this.cancelProjectBtn.click();
    await expect(this.createProjectModal).toBeHidden();
  }

  async openConfigureColumns(): Promise<void> {
    await this.manageColumnsBtn.click();
    await expect(this.configureColumnsModal).toBeVisible();
  }

  async addExistingStage(stageName: string): Promise<void> {
    await this.existingColNameInput.fill(stageName);
    await this.addExistingColBtn.click();
    await this.saveColumnsBtn.click();
    await expect(this.configureColumnsModal).toBeHidden();
  }
}
