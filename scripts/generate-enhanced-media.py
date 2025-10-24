#!/usr/bin/env python3
"""
Generate enhanced placeholder album artwork and audio files
Creates more realistic-looking album covers and genre-appropriate audio
"""

import os
import sys
from pathlib import Path
import random

def generate_enhanced_artwork(filename, width=600, height=600):
    """Generate enhanced album artwork with better visuals"""
    try:
        from PIL import Image, ImageDraw, ImageFont, ImageFilter

        # Extract album info from filename
        album_info = filename.replace('album-', '').replace('.jpg', '').replace('-', ' ').title()

        # Genre-based color palettes
        genre_palettes = {
            'pop': [(255, 105, 180), (135, 206, 250)],      # Pink to Sky Blue
            'rock': [(139, 0, 0), (255, 69, 0)],            # Dark Red to Orange Red
            'jazz': [(75, 0, 130), (255, 215, 0)],          # Indigo to Gold
            'electronic': [(0, 255, 255), (255, 0, 255)],   # Cyan to Magenta
            'folk': [(34, 139, 34), (210, 180, 140)],       # Forest Green to Tan
            'hip-hop': [(0, 0, 0), (255, 215, 0)],          # Black to Gold
            'r&b': [(139, 0, 139), (255, 192, 203)],        # Dark Magenta to Pink
            'classical': [(25, 25, 112), (240, 248, 255)],  # Midnight Blue to Alice Blue
            'edm': [(255, 0, 255), (0, 255, 255)],          # Magenta to Cyan
            'indie': [(188, 143, 143), (245, 222, 179)],    # Rosy Brown to Wheat
        }

        # Select random palette
        palette = random.choice(list(genre_palettes.values()))
        color1, color2 = palette

        # Create base image
        img = Image.new('RGB', (width, height))
        draw = ImageDraw.Draw(img)

        # Create radial gradient from center
        for y in range(height):
            for x in range(width):
                # Calculate distance from center
                dx = x - width/2
                dy = y - height/2
                distance = (dx*dx + dy*dy) ** 0.5
                max_distance = (width*width/4 + height*height/4) ** 0.5
                ratio = min(distance / max_distance, 1.0)

                # Interpolate colors
                r = int(color1[0] + (color2[0] - color1[0]) * ratio)
                g = int(color1[1] + (color2[1] - color1[1]) * ratio)
                b = int(color1[2] + (color2[2] - color1[2]) * ratio)

                draw.point((x, y), fill=(r, g, b))

        # Add some texture/noise
        # Apply slight blur for smoother gradients
        img = img.filter(ImageFilter.GaussianBlur(radius=2))

        # Add geometric pattern overlay
        overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)

        # Random geometric shapes
        pattern_type = random.choice(['circles', 'lines', 'rectangles'])

        if pattern_type == 'circles':
            for _ in range(random.randint(3, 8)):
                x = random.randint(0, width)
                y = random.randint(0, height)
                radius = random.randint(30, 150)
                overlay_draw.ellipse(
                    [(x-radius, y-radius), (x+radius, y+radius)],
                    fill=None,
                    outline=(255, 255, 255, 50),
                    width=3
                )
        elif pattern_type == 'lines':
            for _ in range(random.randint(5, 15)):
                x1, y1 = random.randint(0, width), random.randint(0, height)
                x2, y2 = random.randint(0, width), random.randint(0, height)
                overlay_draw.line(
                    [(x1, y1), (x2, y2)],
                    fill=(255, 255, 255, 40),
                    width=2
                )
        else:  # rectangles
            for _ in range(random.randint(3, 7)):
                x1, y1 = random.randint(0, width-100), random.randint(0, height-100)
                x2, y2 = x1 + random.randint(50, 200), y1 + random.randint(50, 200)
                overlay_draw.rectangle(
                    [(x1, y1), (x2, y2)],
                    fill=None,
                    outline=(255, 255, 255, 60),
                    width=2
                )

        img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')

        # Add text overlay at bottom
        text_overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        text_draw = ImageDraw.Draw(text_overlay)

        # Semi-transparent bar at bottom
        text_draw.rectangle([(0, height-120), (width, height)], fill=(0, 0, 0, 180))

        img = Image.alpha_composite(img.convert('RGBA'), text_overlay).convert('RGB')

        # Add album title text
        draw = ImageDraw.Draw(img)

        # Try to load a nice font
        try:
            title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 32)
            subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 18)
        except:
            title_font = ImageFont.load_default()
            subtitle_font = ImageFont.load_default()

        # Extract artist and album from filename
        parts = album_info.split()
        if len(parts) > 3:
            artist = ' '.join(parts[:2])
            album = ' '.join(parts[2:])
        else:
            artist = parts[0] if parts else ''
            album = ' '.join(parts[1:]) if len(parts) > 1 else ''

        # Draw text
        draw.text((30, height-90), album[:30], fill=(255, 255, 255), font=title_font)
        draw.text((30, height-50), artist[:30], fill=(200, 200, 200), font=subtitle_font)

        return img
    except Exception as e:
        print(f"Error generating artwork: {e}")
        return None

def generate_musical_audio(filename, duration_seconds=180, genre='general'):
    """Generate simple musical audio based on genre"""
    try:
        import numpy as np
        from scipy.io import wavfile

        sample_rate = 44100
        total_samples = sample_rate * duration_seconds

        # Genre-specific musical parameters
        genre_params = {
            'pop': {'tempo': 120, 'key': 'C', 'chords': ['C', 'G', 'Am', 'F']},
            'rock': {'tempo': 140, 'key': 'E', 'chords': ['E', 'A', 'B']},
            'jazz': {'tempo': 100, 'key': 'Bb', 'chords': ['Dm7', 'G7', 'Cmaj7']},
            'electronic': {'tempo': 128, 'key': 'Am', 'chords': ['Am', 'F', 'C', 'G']},
            'folk': {'tempo': 90, 'key': 'D', 'chords': ['D', 'G', 'A']},
            'hip-hop': {'tempo': 90, 'key': 'Gm', 'chords': ['Gm', 'Eb', 'Bb']},
            'classical': {'tempo': 80, 'key': 'G', 'chords': ['G', 'D', 'Em', 'C']},
        }

        params = genre_params.get(genre.lower(), genre_params['pop'])
        tempo = params['tempo']

        # Note frequencies (simplified)
        notes = {
            'C': 261.63, 'D': 293.66, 'E': 329.63, 'F': 349.23,
            'G': 392.00, 'A': 440.00, 'B': 493.88
        }

        # Create a simple melody
        audio = np.zeros(total_samples)

        # Beat duration in samples
        beat_duration = int(sample_rate * 60 / tempo)

        # Create a simple 4-bar pattern
        pattern_notes = ['C', 'E', 'G', 'E', 'C', 'G', 'E', 'C']

        for i in range(0, total_samples, beat_duration):
            note_idx = (i // beat_duration) % len(pattern_notes)
            note = pattern_notes[note_idx]
            freq = notes[note]

            # Generate note with envelope
            note_samples = min(beat_duration, total_samples - i)
            t = np.linspace(0, note_samples / sample_rate, note_samples)

            # ADSR envelope (simplified)
            attack = int(note_samples * 0.1)
            decay = int(note_samples * 0.2)
            sustain_level = 0.7
            release = int(note_samples * 0.3)

            envelope = np.ones(note_samples)
            # Attack
            if attack > 0:
                envelope[:attack] = np.linspace(0, 1, attack)
            # Decay
            if decay > 0:
                envelope[attack:attack+decay] = np.linspace(1, sustain_level, decay)
            # Sustain
            envelope[attack+decay:-release] = sustain_level
            # Release
            if release > 0:
                envelope[-release:] = np.linspace(sustain_level, 0, release)

            # Generate tone with harmonics for richer sound
            tone = np.sin(2 * np.pi * freq * t)  # Fundamental
            tone += 0.3 * np.sin(2 * np.pi * freq * 2 * t)  # 2nd harmonic
            tone += 0.1 * np.sin(2 * np.pi * freq * 3 * t)  # 3rd harmonic

            tone = tone * envelope * 0.3  # Reduce volume
            audio[i:i+note_samples] += tone

        # Normalize audio
        audio = audio / np.max(np.abs(audio)) * 0.8

        # Add fade out at the end
        fade_duration = sample_rate * 2  # 2 second fade
        if len(audio) > fade_duration:
            fade = np.linspace(1, 0, fade_duration)
            audio[-fade_duration:] *= fade

        # Convert to 16-bit PCM
        audio = (audio * 32767).astype(np.int16)

        return audio, sample_rate
    except Exception as e:
        print(f"Error generating audio: {e}")
        return None, None

def main():
    print("🎨🎵 Generating Enhanced Media Files...")
    print("=" * 60)

    project_root = Path(__file__).parent.parent
    artwork_dir = project_root / 'public' / 'uploads' / 'artwork'
    audio_dir = project_root / 'public' / 'uploads' / 'audio'

    # Regenerate all artwork with enhanced version
    print("\n📸 Regenerating Enhanced Album Artwork...")
    artwork_count = 0

    expected_artworks = [
        "album-luna-martinez-starlight-dreams.jpg",
        "album-luna-martinez-midnight-reverie.jpg",
        "album-the-midnight-owls-concrete-hearts.jpg",
        "album-the-midnight-owls-echo-chamber.jpg",
        "album-jasmine-chen-digital-horizons.jpg",
        "album-jasmine-chen-neon-nights.jpg",
        "album-marcus-johnson-blue-note-sessions.jpg",
        "album-wildfire-collective-mountain-songs.jpg",
        "album-wildfire-collective-whispers-in-the-wind.jpg",
        "album-neon-dreams-retrowave-memories.jpg",
        "album-rosa-delgado-piano-reflections.jpg",
        "album-the-basement-sessions-homegrown.jpg",
        "album-the-basement-sessions-late-night-thoughts.jpg",
        "album-dj-solaris-boom-bap-chronicles.jpg",
        "album-echo-valley-distant-shores.jpg",
        "album-echo-valley-horizons.jpg",
        "album-sarah-winters-wildflower.jpg",
        "album-voltage-electric-soul.jpg",
        "album-the-blues-brothers-revival-chicago-nights.jpg",
        "album-cosmic-waves-interstellar-journey.jpg",
        "album-maya-torres-velvet-voice.jpg",
        "album-maya-torres-midnight-soul.jpg",
        "album-the-wanderers-global-rhythms.jpg",
        "album-apex-beats-progressive-waves.jpg",
        "album-oliver-grant-silent-echoes.jpg",
        "album-luna-martinez-indie-nights-vol-1.jpg",
        "album-jasmine-chen-electronic-fusion.jpg",
    ]

    for artwork_name in expected_artworks:
        artwork_path = artwork_dir / artwork_name
        img = generate_enhanced_artwork(artwork_name, width=600, height=600)
        if img:
            img.save(artwork_path, 'JPEG', quality=90)
            artwork_count += 1
            print(f"  ✓ {artwork_name}")

    print(f"\n✅ Generated {artwork_count} enhanced artwork images (600x600, higher quality)")

    # Generate more audio samples
    print("\n🎵 Generating Musical Audio Samples...")
    print("Note: Generating 30 sample audio files (3 minutes each)...")

    audio_count = 0
    genres = ['pop', 'rock', 'jazz', 'electronic', 'folk', 'hip-hop', 'classical']

    for i in range(1, 31):  # Generate 30 samples
        genre = genres[(i - 1) % len(genres)]
        wav_file = audio_dir / f'song-sample-{i:03d}.wav'

        audio_data, sample_rate = generate_musical_audio(
            wav_file.name,
            duration_seconds=180,  # 3 minutes
            genre=genre
        )

        if audio_data is not None:
            from scipy.io import wavfile
            wavfile.write(wav_file, sample_rate, audio_data)
            audio_count += 1
            print(f"  ✓ song-sample-{i:03d}.wav ({genre})")

    print(f"\n✅ Generated {audio_count} musical audio samples (3 minutes each)")

    print("\n" + "=" * 60)
    print("🎉 Enhanced Media Generation Complete!")
    print("\nSummary:")
    print(f"  • {artwork_count} album artworks (600x600, enhanced design)")
    print(f"  • {audio_count} audio samples (3 min each, genre-specific)")
    print("\nThese are still placeholders suitable for development/demo.")
    print("For production, use licensed content or original recordings.")

if __name__ == '__main__':
    main()
