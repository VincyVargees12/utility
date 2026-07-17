import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss'
})
export class FileUploaderComponent {
  // Inputs
  buttonText = input<string>('Select PDF file');
  subtitleText = input<string>('or drop PDF here');
  accept = input<string>('application/pdf');
  multiple = input<boolean>(false);
  errorMessage = input<string | null>(null);
  
  // Outputs
  fileSelected = output<FileList>();
  
  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileSelected.emit(input.files);
    }
  }
  
  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.fileSelected.emit(event.dataTransfer.files);
    }
  }
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
