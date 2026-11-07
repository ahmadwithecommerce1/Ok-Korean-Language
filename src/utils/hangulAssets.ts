/**
 * Direct ES Module Asset Imports for Hangul Phoneme Audio Files
 * 
 * Importing assets directly through Vite ensures:
 * 1. Proper bundling into /dist/assets/ with content hashing for Vercel deployments.
 * 2. Guaranteed correct MIME types (audio/mpeg) on Vercel CDN.
 * 3. Complete immunity to SPA router 404s or subpath mismatch.
 */

// Basic Consonants (14)
import sound_giyeok from '../assets/sounds/giyeok.mp3';
import sound_nieun from '../assets/sounds/nieun.mp3';
import sound_digeut from '../assets/sounds/digeut.mp3';
import sound_rieul from '../assets/sounds/rieul.mp3';
import sound_mieum from '../assets/sounds/mieum.mp3';
import sound_bieup from '../assets/sounds/bieup.mp3';
import sound_siot from '../assets/sounds/siot.mp3';
import sound_ieung from '../assets/sounds/ieung.mp3';
import sound_jieut from '../assets/sounds/jieut.mp3';
import sound_chieut from '../assets/sounds/chieut.mp3';
import sound_kieuk from '../assets/sounds/kieuk.mp3';
import sound_tieut from '../assets/sounds/tieut.mp3';
import sound_pieup from '../assets/sounds/pieup.mp3';
import sound_hieut from '../assets/sounds/hieut.mp3';

// Double Consonants (5)
import sound_ssanggiyeok from '../assets/sounds/ssanggiyeok.mp3';
import sound_ssangdigeut from '../assets/sounds/ssangdigeut.mp3';
import sound_ssangbieup from '../assets/sounds/ssangbieup.mp3';
import sound_ssangsiot from '../assets/sounds/ssangsiot.mp3';
import sound_ssangjieut from '../assets/sounds/ssangjieut.mp3';

// Basic Vowels (10)
import sound_a from '../assets/sounds/a.mp3';
import sound_ya from '../assets/sounds/ya.mp3';
import sound_eo from '../assets/sounds/eo.mp3';
import sound_yeo from '../assets/sounds/yeo.mp3';
import sound_o from '../assets/sounds/o.mp3';
import sound_yo from '../assets/sounds/yo.mp3';
import sound_u from '../assets/sounds/u.mp3';
import sound_yu from '../assets/sounds/yu.mp3';
import sound_eu from '../assets/sounds/eu.mp3';
import sound_i from '../assets/sounds/i.mp3';

// Compound Vowels (11)
import sound_ae from '../assets/sounds/ae.mp3';
import sound_yae from '../assets/sounds/yae.mp3';
import sound_e from '../assets/sounds/e.mp3';
import sound_ye from '../assets/sounds/ye.mp3';
import sound_wa from '../assets/sounds/wa.mp3';
import sound_wae from '../assets/sounds/wae.mp3';
import sound_oe from '../assets/sounds/oe.mp3';
import sound_wo from '../assets/sounds/wo.mp3';
import sound_we from '../assets/sounds/we.mp3';
import sound_wi from '../assets/sounds/wi.mp3';
import sound_ui from '../assets/sounds/ui.mp3';

// Batchim (7 Representative)
import sound_batchim_k from '../assets/sounds/batchim_k.mp3';
import sound_batchim_n from '../assets/sounds/batchim_n.mp3';
import sound_batchim_t from '../assets/sounds/batchim_t.mp3';
import sound_batchim_l from '../assets/sounds/batchim_l.mp3';
import sound_batchim_m from '../assets/sounds/batchim_m.mp3';
import sound_batchim_p from '../assets/sounds/batchim_p.mp3';
import sound_batchim_ng from '../assets/sounds/batchim_ng.mp3';

export const HANGUL_AUDIO_ASSETS: Record<string, string> = {
  // Consonants
  consonant_giyeok: sound_giyeok,
  consonant_nieun: sound_nieun,
  consonant_digeut: sound_digeut,
  consonant_rieul: sound_rieul,
  consonant_mieum: sound_mieum,
  consonant_bieup: sound_bieup,
  consonant_siot: sound_siot,
  consonant_ieung: sound_ieung,
  consonant_jieut: sound_jieut,
  consonant_chieut: sound_chieut,
  consonant_kieuk: sound_kieuk,
  consonant_tieut: sound_tieut,
  consonant_pieup: sound_pieup,
  consonant_hieut: sound_hieut,

  // Double Consonants
  double_ssanggiyeok: sound_ssanggiyeok,
  double_ssangdigeut: sound_ssangdigeut,
  double_ssangbieup: sound_ssangbieup,
  double_ssangsiot: sound_ssangsiot,
  double_ssangjieut: sound_ssangjieut,

  // Basic Vowels
  vowel_a: sound_a,
  vowel_ya: sound_ya,
  vowel_eo: sound_eo,
  vowel_yeo: sound_yeo,
  vowel_o: sound_o,
  vowel_yo: sound_yo,
  vowel_u: sound_u,
  vowel_yu: sound_yu,
  vowel_eu: sound_eu,
  vowel_i: sound_i,

  // Compound Vowels
  compound_ae: sound_ae,
  compound_yae: sound_yae,
  compound_e: sound_e,
  compound_ye: sound_ye,
  compound_wa: sound_wa,
  compound_wae: sound_wae,
  compound_oe: sound_oe,
  compound_wo: sound_wo,
  compound_we: sound_we,
  compound_wi: sound_wi,
  compound_ui: sound_ui,

  // Batchim
  batchim_k: sound_batchim_k,
  batchim_n: sound_batchim_n,
  batchim_t: sound_batchim_t,
  batchim_l: sound_batchim_l,
  batchim_m: sound_batchim_m,
  batchim_p: sound_batchim_p,
  batchim_ng: sound_batchim_ng,
};
