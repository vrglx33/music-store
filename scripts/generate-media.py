#!/usr/bin/env python3
"""
Generate placeholder album artwork images and audio files
"""

import os
import sys
from pathlib import Path

def generate_placeholder_image(filename, width=400, height=400):
    """Generate a placeholder image using PIL"""
    try:
        from PIL import Image, ImageDraw, ImageFont
        import random

        # Create image with random gradient background
        img = Image.new('RGB', (width, height))
        draw = ImageDraw.Draw(img)

        # Random color palette
        colors = [
            (65, 105, 225),   # Royal Blue
            (220, 20, 60),    # Crimson
            (255, 140, 0),    # Dark Orange
            (75, 0, 130),     # Indigo
            (0, 128, 128),    # Teal
            (255, 69, 0),     # Red-Orange
            (139, 0, 139),    # Dark Magenta
            (0, 100, 0),      # Dark Green
        ]

        color1 = random.choice(colors)
        color2 = random.choice([c for c in colors if c != color1])

        # Create gradient
        for y in range(height):
            r = int(color1[0] + (color2[0] - color1[0]) * y / height)
            g = int(color1[1] + (color2[1] - color1[1]) * y / height)
            b = int(color1[2] + (color2[2] - color1[2]) * y / height)
            draw.rectangle([(0, y), (width, y+1)], fill=(r, g, b))

        # Add text overlay
        album_name = filename.replace('album-', '').replace('.jpg', '').replace('-', ' ').title()

        # Try to use a font, fallback to default
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
        except:
            font = ImageFont.load_default()

        # Add semi-transparent overlay for text readability
        overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        overlay_draw.rectangle([(0, height-80), (width, height)], fill=(0, 0, 0, 128))
        img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')

        draw = ImageDraw.Draw(img)
        draw.text((20, height-60), album_name[:30], fill=(255, 255, 255), font=font)

        return img
    except ImportError:
        print("Warning: PIL not available, creating minimal placeholder")
        return None

def generate_placeholder_audio(filename, duration_seconds=180):
    """Generate a silent audio file or simple tone"""
    try:
        import numpy as np
        from scipy.io import wavfile

        sample_rate = 44100

        # Generate a simple sine wave at 440 Hz (A note) for first 2 seconds, then silence
        t = np.linspace(0, 2, sample_rate * 2)
        tone = np.sin(2 * np.pi * 440 * t) * 0.1

        # Add silence for the rest
        silence = np.zeros(sample_rate * (duration_seconds - 2))
        audio = np.concatenate([tone, silence])

        # Convert to 16-bit PCM
        audio = (audio * 32767).astype(np.int16)

        return audio, sample_rate
    except ImportError:
        print("Warning: numpy/scipy not available, creating minimal placeholder")
        return None, None

def main():
    project_root = Path(__file__).parent.parent
    artwork_dir = project_root / 'public' / 'uploads' / 'artwork'
    audio_dir = project_root / 'public' / 'uploads' / 'audio'

    print("🎨 Generating placeholder media files...")
    print(f"Artwork directory: {artwork_dir}")
    print(f"Audio directory: {audio_dir}")

    # Ensure directories exist
    artwork_dir.mkdir(parents=True, exist_ok=True)
    audio_dir.mkdir(parents=True, exist_ok=True)

    # Generate artwork images
    artwork_count = 0
    for artwork_file in artwork_dir.glob('*.jpg'):
        if not artwork_file.exists() or artwork_file.stat().st_size == 0:
            img = generate_placeholder_image(artwork_file.name)
            if img:
                img.save(artwork_file, 'JPEG', quality=85)
                artwork_count += 1

    # Find all expected artwork files from seed
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
        if not artwork_path.exists():
            img = generate_placeholder_image(artwork_name)
            if img:
                img.save(artwork_path, 'JPEG', quality=85)
                artwork_count += 1
                print(f"  Created: {artwork_name}")

    print(f"\n✅ Generated {artwork_count} artwork images")

    # Generate audio files (we'll create fewer since there are 248 songs)
    audio_count = 0
    print("\n🎵 Generating placeholder audio files...")
    print("Note: Generating minimal audio files (this may take a moment)...")

    # For now, create a few sample audio files
    # In production, you'd want to generate all 248, but that would take time
    sample_songs = 10

    for i in range(1, sample_songs + 1):
        audio_file = audio_dir / f'sample-song-{i}.mp3'
        if not audio_file.exists():
            audio_data, sample_rate = generate_placeholder_audio(audio_file.name, duration_seconds=30)
            if audio_data is not None:
                # Save as WAV (simpler than MP3 encoding)
                wav_file = audio_dir / f'sample-song-{i}.wav'
                from scipy.io import wavfile
                wavfile.write(wav_file, sample_rate, audio_data)
                audio_count += 1
                print(f"  Created: sample-song-{i}.wav")

    print(f"\n✅ Generated {audio_count} sample audio files (WAV format)")
    print(f"\n⚠️  Note: For a production app, you would need to:")
    print(f"   - Generate all 248 audio files")
    print(f"   - Convert WAV to MP3 for better compression")
    print(f"   - Or use actual music content with proper licensing")

    print("\n🎉 Media generation complete!")

if __name__ == '__main__':
    main()
