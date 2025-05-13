use rayon::prelude::*;

pub fn monte_carlo_pi_parallel(simulations: usize, samples_per_sim: usize) -> Vec<f64> {
    (0..simulations)
        .into_par_iter()
        .map(|_| {
            let inside = (0..samples_per_sim)
                .filter(|_| {
                    let x: f64 = rand::random();
                    let y: f64 = rand::random();
                    x * x + y * y <= 1.0
                })
                .count();

            4.0 * (inside as f64) / (samples_per_sim as f64)
        })
        .collect()
}