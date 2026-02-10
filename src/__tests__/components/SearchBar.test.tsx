import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '@/components/filters/SearchBar';

describe('SearchBar', () => {
  it('renders with initial value', () => {
    render(<SearchBar value="initial" onChange={() => {}} />);
    const input = screen.getByPlaceholderText('Search articles...');
    expect(input).toHaveValue('initial');
  });

  it('updates input on typing', async () => {
    render(<SearchBar value="" onChange={() => {}} />);
    const input = screen.getByPlaceholderText('Search articles...');
    await userEvent.type(input, 'test query');
    expect(input).toHaveValue('test query');
  });

  it('shows clear button when input has value', () => {
    render(<SearchBar value="something" onChange={() => {}} />);
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('does not show clear button when input is empty', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });

  it('clears the search when the user clicks the clear button', async () => {
    const onChange = vi.fn();
    render(<SearchBar value="test" onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Clear search'));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('searches when the user presses Enter', async () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    const input = screen.getByPlaceholderText('Search articles...');
    await userEvent.type(input, 'query{Enter}');
    expect(onChange).toHaveBeenCalledWith('query');
  });
});
