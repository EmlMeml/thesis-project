import { render, screen } from '@testing-library/react';
import { generatePrompt } from './custom/ChangeCreator';
import { serializeEditorContentToParagraphs } from './App';
import { MyEditor } from './custom/Editor';
import { TextNav } from './custom/TextNav';

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

test('renders the navigation vertically with a fixed width and dynamic segment height', () => {
  render(<TextNav content={[{ type: 'paragraph', children: [{ text: 'Alpha' }] }]} />);

  const nav = screen.getByTestId('text-nav');
  const segment = screen.getByRole('button');

  expect(nav).toHaveStyle({ display: 'flex', flexDirection: 'column', width: '92px' });
  expect(segment).toHaveStyle({ width: '92px', height: '48px' });
});

test('uses change count to speed up the segment animation', () => {
  render(
    <TextNav
      content={[{ type: 'paragraph', children: [{ text: 'Alpha' }] }]}
      changedTexts={['Alpha']}
      changedSegments={[{ text: 'Alpha', changeNumber: 24 }]}
    />
  );

  const segment = screen.getByRole('button');
  expect(segment).toHaveStyle({ '--ripple-duration': '2.4s' });
});
