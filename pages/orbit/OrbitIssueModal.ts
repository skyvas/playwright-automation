import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';

export class OrbitIssueModal extends BasePage {
  // Create Issue
  readonly createModal: Locator;
  readonly issueProjectSelect: Locator;
  readonly issueSprintSelect: Locator;
  readonly issueTitleInput: Locator;
  readonly issueDescInput: Locator;
  readonly issuePrioritySelect: Locator;
  readonly issueStatusSelect: Locator;
  readonly issueTypeSelect: Locator;
  readonly issuePointsInput: Locator;
  readonly issueAssigneeSelect: Locator;
  readonly issueTagsInput: Locator;
  readonly issueFileInput: Locator;
  readonly submitIssueBtn: Locator;
  readonly cancelIssueBtn: Locator;

  // Issue Detail
  readonly detailModal: Locator;
  readonly detailIssueKey: Locator;
  readonly detailTitleInput: Locator;
  readonly detailDescInput: Locator;
  readonly detailPrioritySelect: Locator;
  readonly detailPointsInput: Locator;
  readonly detailTagsInput: Locator;
  readonly detailCloseBtn: Locator;
  readonly saveIssueDetailsBtn: Locator;
  readonly detailSaveMsg: Locator;

  // Checklist
  readonly newChecklistItemInput: Locator;
  readonly addChecklistItemBtn: Locator;
  readonly checklistCounter: Locator;
  readonly checklistItems: Locator;

  // Comments
  readonly commentInput: Locator;
  readonly submitCommentBtn: Locator;
  readonly commentsStream: Locator;

  // Attachments & Lightbox
  readonly detailAttachmentsGrid: Locator;
  readonly lightboxModal: Locator;
  readonly lightboxDownload: Locator;
  readonly lightboxClose: Locator;

  constructor(page: Page) {
    super(page);
    this.createModal = page.locator('#create-modal');
    this.issueProjectSelect = page.locator('#issue-project');
    this.issueSprintSelect = page.locator('#issue-sprint');
    this.issueTitleInput = page.locator('#issue-title');
    this.issueDescInput = page.locator('#issue-desc');
    this.issuePrioritySelect = page.locator('#issue-priority');
    this.issueStatusSelect = page.locator('#issue-status');
    this.issueTypeSelect = page.locator('#issue-type');
    this.issuePointsInput = page.locator('#issue-points');
    this.issueAssigneeSelect = page.locator('#issue-assignee');
    this.issueTagsInput = page.locator('#issue-tags');
    this.issueFileInput = page.locator('#issue-file-input');
    this.submitIssueBtn = page.locator('#create-issue-form button[type="submit"]');
    this.cancelIssueBtn = page.locator('#btn-cancel');

    this.detailModal = page.locator('#issue-detail-modal');
    this.detailIssueKey = page.locator('#detail-issue-key');
    this.detailTitleInput = page.locator('#detail-title-input');
    this.detailDescInput = page.locator('#detail-desc-input');
    this.detailPrioritySelect = page.locator('#detail-priority-select');
    this.detailPointsInput = page.locator('#detail-points-input');
    this.detailTagsInput = page.locator('#detail-tags-input');
    this.detailCloseBtn = page.locator('#detail-modal-close');
    this.saveIssueDetailsBtn = page.locator('#btn-save-issue-details');
    this.detailSaveMsg = page.locator('#detail-save-msg');

    this.newChecklistItemInput = page.locator('#input-new-checklist-item');
    this.addChecklistItemBtn = page.locator('#btn-add-checklist-item');
    this.checklistCounter = page.locator('#detail-checklist-counter');
    this.checklistItems = page.locator('#detail-checklist-items');

    this.commentInput = page.locator('#comment-input');
    this.submitCommentBtn = page.locator('#btn-submit-comment');
    this.commentsStream = page.locator('#detail-comments-stream');

    this.detailAttachmentsGrid = page.locator('#detail-attachments-grid');
    this.lightboxModal = page.locator('#lightbox-modal');
    this.lightboxDownload = page.locator('#lightbox-download');
    this.lightboxClose = page.locator('#lightbox-close');
  }

  async createIssue(data: {
    title: string;
    description?: string;
    priority?: string;
    type?: string;
    points?: number;
    tags?: string;
  }): Promise<void> {
    await this.issueTitleInput.fill(data.title);
    if (data.description) await this.issueDescInput.fill(data.description);
    if (data.priority) await this.issuePrioritySelect.selectOption(data.priority);
    if (data.type) await this.issueTypeSelect.selectOption(data.type);
    if (data.points !== undefined) await this.issuePointsInput.fill(data.points.toString());
    if (data.tags) await this.issueTagsInput.fill(data.tags);
    await this.submitIssueBtn.click();
    await expect(this.createModal).toBeHidden();
  }

  async openIssueCard(issueKeyOrText?: string): Promise<void> {
    if (issueKeyOrText) {
      const card = this.page.locator('.issue-card', { hasText: issueKeyOrText }).first();
      await card.click();
    } else {
      await this.page.locator('.issue-card').first().click();
    }
    await expect(this.detailModal).toBeVisible();
  }

  async addChecklistItem(itemText: string): Promise<void> {
    await this.newChecklistItemInput.fill(itemText);
    await this.addChecklistItemBtn.click();
  }

  async toggleChecklistItem(index: number = 0): Promise<void> {
    const checkbox = this.checklistItems.locator('input[type="checkbox"]').nth(index);
    await checkbox.click();
  }

  async postComment(commentText: string): Promise<void> {
    await this.commentInput.fill(commentText);
    await this.submitCommentBtn.click();
    await expect(this.commentsStream).toContainText(commentText);
  }

  async saveChanges(): Promise<void> {
    await this.saveIssueDetailsBtn.click();
    await expect(this.detailSaveMsg).toBeVisible();
  }

  async closeDetailModal(): Promise<void> {
    await this.detailCloseBtn.click();
    await expect(this.detailModal).toBeHidden();
  }
}
