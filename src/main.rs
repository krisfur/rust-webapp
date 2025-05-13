use axum::{routing::{get_service, post},Json, Router};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tokio::net::TcpListener;
use tower_http::services::ServeDir;

mod compute;

#[derive(Deserialize)]
struct MonteCarloRequest {
    simulations: usize,
    samples_per_sim: usize,
}

#[derive(Serialize)]
struct MonteCarloResponse {
    estimates: Vec<f64>,
}

async fn run_pi_sim(Json(payload): Json<MonteCarloRequest>) -> Json<MonteCarloResponse> {
    let estimates = compute::monte_carlo_pi_parallel(payload.simulations, payload.samples_per_sim);
    Json(MonteCarloResponse { estimates })
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .fallback_service(get_service(ServeDir::new("static")))
        .route("/api/pi", post(run_pi_sim));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    let listener = TcpListener::bind(addr).await.unwrap();
    println!("Listening on http://{}", addr);

    axum::serve(listener, app).await.unwrap();
}
