/**
 * The reads, described once.
 *
 * Every read's title, imprint, date and length used to be typed on its page,
 * again in /read, again in feed.xml.ts, and its length a fourth time as a sum
 * on the /read share card. The copies disagreed:
 *   - Three reads were dated 4, 12 and 20 May in their Article markup and the
 *     feed, and one of them says in its own text that its figures are
 *     "current to June 1, 2026". The legacy site dated all five 1 June 2026,
 *     and two of the original bylines read "June 2026". Nothing on the page
 *     showed a date, so nothing a reader saw could catch it.
 *   - The lengths were off by up to 6% from the articles they described
 *     (2,717 words claimed for a body of 2,637).
 * Now the page, /read, the feed, the Article markup, the OG article tags and
 * the share card all read this array, the date is printed on every read, and
 * tools/check-figures.cjs counts each built article and fails the build when
 * `words` is not its count, printing the number to write here.
 *
 * `published` is the first publication, backed by the read's own text where it
 * has one: The Closed Loop prints "RELEASED 31 May 2026"; The Vertical
 * Squeeze's source PDF is dated 20260529; the other three follow the legacy
 * site's 1 June, which is also when the recession piece's figures end. Change
 * one only with a better source than that.
 *
 * In the order /read lists them, which is the editor's; the feed sorts by date.
 */
export interface ReadMeta {
  slug: string;
  title: string;
  /** Caps label above the headline, and the Article's section. */
  imprint: string;
  /** One or two sentences for /read and the feed. */
  blurb: string;
  /** The feed's summary where it differs from the blurb. */
  feed?: string;
  /** First published, YYYY-MM-DD. */
  published: string;
  /** Counted from the built article by check-figures, never estimated. */
  words: number;
}

export const READS: ReadMeta[] = [
  {
    slug: 'the-red-is-the-work', title: 'The Red Is the Work', imprint: 'A reading of the leaf',
    blurb: 'The red on a maple leaf is not the leaf dying. The tree makes it, on purpose, to cover the work of taking back what it needs before winter. A reading of the flag.',
    published: '2026-09-24', words: 1180,
  },
  {
    slug: 'the-closed-loop', title: 'The Closed Loop', imprint: 'NPSI · Working Paper No. 6',
    blurb: 'How Canadian energy, minerals and two-ocean geography become one forty-year trade with Korea. The anchor case for the middle-power argument.',
    feed: 'How Canadian energy, minerals and two-ocean geography become one forty-year trade with Korea. Korea holds the silicon; Canada holds the power.',
    published: '2026-05-31', words: 2648,
  },
  {
    slug: 'the-vertical-squeeze', title: 'The Vertical Squeeze', imprint: 'Fit For Gov · Dossier',
    blurb: 'The order of government closest to you has the most responsibility and the least revenue. The imbalance, costed.',
    published: '2026-05-29', words: 3722,
  },
  {
    slug: 'changed-my-mind', title: 'I Campaigned Against This Man', imprint: 'An honest account',
    blurb: 'A Conservative campaigner did the homework and changed his mind. Not a conversion — an argument for looking instead of yelling.',
    published: '2026-06-01', words: 1219,
  },
  {
    slug: 'two-leaders', title: 'The Wave Hit Every G7 Democracy. Two Leaders Beat It.', imprint: 'A governance reading',
    blurb: 'Anti-incumbent anger flattened the West. Two leaders are the exceptions, and the reason is a method, not a party.',
    published: '2026-06-01', words: 758,
  },
  {
    slug: 'honest-answer', title: 'One Question. Seven Leaders. An Honest Answer.', imprint: 'The record, set straight',
    blurb: 'The viral "who is in recession" quiz, answered with every official G7 GDP figure. The trick is in the question.',
    published: '2026-06-01', words: 710,
  },
];

export function read(slug: string): ReadMeta {
  const r = READS.find((x) => x.slug === slug);
  if (!r) throw new Error(`src/lib/reads.ts has no read "${slug}"`);
  return r;
}

/** "1 June 2026", the form the site already prints dates in. */
export const longDate = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${iso}T12:00:00Z`));
