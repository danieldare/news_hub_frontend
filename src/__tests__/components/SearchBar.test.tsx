import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '@/components/filters/SearchBar';

describe('SearchBar', () => {
  it('renders with initial value', () => {
    render(<SearchBar value="initial" onChange={() => {}} />);
    const input = screen.getByPlaceholderText('Search articles...');
    expect(input).toHaveValue('initial');
  });

  it('updates input on typing', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    const input = screen.getByPlaceholderText('Search articles...');
    fireEvent.change(input, { target: { value: 'test query' } });
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

  it('clears input and calls onChange when clear is clicked', () => {
    const onChange = vi.fn();
    render(<SearchBar value="test" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Clear search'));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('calls onChange on form submit', () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    const input = screen.getByPlaceholderText('Search articles...');
    fireEvent.change(input, { target: { value: 'query' } });
    fireEvent.submit(input.closest('form')!);
    expect(onChange).toHaveBeenCalledWith('query');
  });
});
