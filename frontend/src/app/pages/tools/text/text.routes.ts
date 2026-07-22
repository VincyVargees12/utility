import { Routes } from '@angular/router';

export const TEXT_TOOL_ROUTES: Routes = [
  {
    path: 'word-counter',
    loadComponent: () => import('./word-counter/word-counter.component').then(m => m.WordCounterComponent),
    title: 'Word Counter - DataUtil'
  },
  {
    path: 'character-counter',
    loadComponent: () => import('./character-counter/character-counter.component').then(m => m.CharacterCounterComponent),
    title: 'Character Counter - DataUtil'
  },
  {
    path: 'case-converter',
    loadComponent: () => import('./case-converter/case-converter.component').then(m => m.CaseConverterComponent),
    title: 'Case Converter - DataUtil'
  },
  {
    path: 'remove-extra-spaces',
    loadComponent: () => import('./remove-extra-spaces/remove-extra-spaces.component').then(m => m.RemoveExtraSpacesComponent),
    title: 'Remove Extra Spaces - DataUtil'
  },
  {
    path: 'reverse-text',
    loadComponent: () => import('./reverse-text/reverse-text.component').then(m => m.ReverseTextComponent),
    title: 'Reverse Text - DataUtil'
  },
  {
    path: 'sort-lines',
    loadComponent: () => import('./sort-lines/sort-lines.component').then(m => m.SortLinesComponent),
    title: 'Sort Lines - DataUtil'
  },
  {
    path: 'duplicate-remover',
    loadComponent: () => import('./duplicate-remover/duplicate-remover.component').then(m => m.DuplicateRemoverComponent),
    title: 'Remove Duplicates - DataUtil'
  },
  {
    path: 'find-replace',
    loadComponent: () => import('./find-replace/find-replace.component').then(m => m.FindReplaceComponent),
    title: 'Find and Replace - DataUtil'
  },
  {
    path: 'text-difference',
    loadComponent: () => import('./text-difference/text-difference.component').then(m => m.TextDifferenceComponent),
    title: 'Text Difference - DataUtil'
  }
];