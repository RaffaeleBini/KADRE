import { describe, expect, it } from 'vitest';
import { sanitizeRepoSlug, slugify } from '../src/generator';

describe('slugify', () => {
  it('toglie gli accenti invece di perdere le lettere', () => {
    expect(slugify('Cuaderno Técnico')).toBe('cuaderno-tecnico');
    expect(slugify('Città di Modena')).toBe('citta-di-modena');
    expect(slugify('Ñandú')).toBe('nandu');
  });

  it('pulisce spazi, simboli e trattini ai bordi', () => {
    expect(slugify('  Café "Luna" & Co\'s!! ')).toBe('cafe-luna-co-s');
    expect(slugify('---')).toBe('');
  });

  it('usa un nome di ripiego se non resta nulla', () => {
    expect(sanitizeRepoSlug('!!!', 'es')).toBe('mi-web-automatizada');
    expect(sanitizeRepoSlug('!!!', 'it')).toBe('mio-sito-web');
  });
});
