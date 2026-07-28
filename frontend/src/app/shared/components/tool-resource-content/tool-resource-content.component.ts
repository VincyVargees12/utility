import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolResourceContent } from './tool-resource-content.types';

@Component({
  selector: 'app-tool-resource-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tool-resource-content.component.html',
  styleUrl: './tool-resource-content.component.scss'
})
export class ToolResourceContentComponent {
  @Input({ required: true }) data!: ToolResourceContent;
}
