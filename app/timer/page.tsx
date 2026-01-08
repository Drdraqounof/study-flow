
import Sidebar from "../../components/Sidebar";
import { useTimer } from "../context/TimerContext";
import { useState, useRef } from "react";



export default function StudySessionsPage() {
	const { mode, timeLeft, isRunning, startTimer, pauseTimer, resetTimer } = useTimer();
	const [inputMinutes, setInputMinutes] = useState(25);
	const [musicPlaying, setMusicPlaying] = useState(false);
	const musicRef = useRef<HTMLAudioElement | null>(null);

	// Format time as mm:ss
	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60).toString().padStart(2, "0");
		const s = (seconds % 60).toString().padStart(2, "0");
		return `${m}:${s}`;
	};

	const toggleMusic = async () => {
		if (!musicRef.current) return;
		if (musicPlaying) {
			musicRef.current.pause();
			setMusicPlaying(false);
		} else {
			try {
				await musicRef.current.play();
				setMusicPlaying(true);
			} catch (err) {
				setMusicPlaying(false);
			}
		}
	};

	// Pause music if user leaves page (optional, for cleanup)
	// useEffect(() => () => { musicRef.current?.pause(); }, []);

	return (
		<div className="flex min-h-screen bg-gray-50">
			<Sidebar active="Study Sessions" />
			<main className="flex-1 p-8">
				<h2 className="text-2xl font-semibold mb-4">Study Sessions</h2>
				<div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 flex flex-col items-center">
					<div className="text-5xl font-mono mb-4">{formatTime(timeLeft)}</div>
					<div className="mb-4">
						<label className="mr-2">Set Minutes:</label>
						<input
							type="number"
							min={1}
							max={120}
							value={inputMinutes}
							onChange={e => setInputMinutes(Number(e.target.value))}
							className="border rounded px-2 py-1 w-20 text-center"
						/>
					</div>
					<div className="flex gap-2 mb-4">
						<button
							className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
							onClick={() => startTimer("focus", inputMinutes * 60)}
							disabled={isRunning}
						>
							Start
						</button>
						<button
							className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
							onClick={pauseTimer}
							disabled={!isRunning}
						>
							Pause
						</button>
						<button
							className="bg-gray-400 text-white px-4 py-2 rounded"
							onClick={resetTimer}
						>
							Reset
						</button>
					</div>
					<div className="text-sm text-black">Alarm will sound when timer ends.</div>
				</div>
			</main>
		</div>
	);
}
