import { render, screen } from '@testing-library/react';
import { generatePrompt } from './custom/ChangeCreator';
import { serializeEditorContentToParagraphs } from './App';
import { MyEditor } from './custom/Editor';

test('includes editor text content in the generated prompt', () => {
  const prompt = generatePrompt('rewrite this', 1, 2, 'Hello from the editor');

  expect(prompt).toContain('Hello from the editor');
  expect(prompt).toContain('Pond');
  expect(prompt).toContain('Cobblestone');
});

test('serializes editor content into paragraph-tagged history entries', () => {
  const content = [
    { type: 'paragraph', children: [{ text: 'First paragraph' }] },
    { type: 'paragraph', children: [{ text: 'Second paragraph' }] }
  ];

  expect(serializeEditorContentToParagraphs(content)).toBe('<p>First paragraph</p><p>Second paragraph</p>');
});

test('serializes plain text reply into paragraph-tagged history entries', () => {
  const text = 'First paragraph\n\nSecond paragraph';

  expect(serializeEditorContentToParagraphs(text)).toBe('<p>First paragraph</p><p>Second paragraph</p>');
});

test('updates the editor content when fileText changes', async () => {
  const { rerender } = render(<MyEditor fileText="Old content" />);

  expect(await screen.findByText('Old content')).toBeInTheDocument();

  rerender(<MyEditor fileText="New content" />);

  expect(await screen.findByText('New content')).toBeInTheDocument();
});
