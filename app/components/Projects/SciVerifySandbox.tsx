"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Sparkles, BookOpen, RefreshCw, Send } from "lucide-react";
import { soundEngine } from "../../lib/sound";

interface SampleClaim {
  id: string;
  claim: string;
  verdict: "SUPPORTED" | "CONTRADICTED" | "NEI";
  confidence: number;
  domain: string;
  citations: {
    doi: string;
    title: string;
    snippet: string;
    score: number;
  }[];
}

const PRESET_CLAIMS: SampleClaim[] = [
  {
    id: "claim-1",
    claim: "CRISPR-Cas9 endonuclease mediates site-specific double-strand breaks in eukaryotic target genomic sequences.",
    verdict: "SUPPORTED",
    confidence: 98.7,
    domain: "Molecular Genetics",
    citations: [
      {
        doi: "10.1126/science.1225829",
        title: "A Programmable Dual-RNA-Guided DNA Endonuclease in Adaptive Bacterial Immunity",
        snippet: "Cas9 endonuclease can be programmed with single guide RNAs to introduce targeted double-strand breaks at specific DNA loci in human and bacterial cells.",
        score: 0.99,
      },
      {
        doi: "10.1038/nature13011",
        title: "Crystal Structure of Cas9 in Complex with Guide RNA and Target DNA",
        snippet: "Structural characterization confirms the bi-lobed architecture of Cas9 accommodating RNA:DNA heteroduplex with target strand cleavage by HNH and RuvC domains.",
        score: 0.95,
      },
    ],
  },
  {
    id: "claim-2",
    claim: "Standard full self-attention in dense Transformers exhibits linear O(N) computational complexity with sequence length without sparse approximations.",
    verdict: "CONTRADICTED",
    confidence: 97.4,
    domain: "Natural Language Processing",
    citations: [
      {
        doi: "10.48550/arXiv.1706.03762",
        title: "Attention Is All You Need (Vaswani et al.)",
        snippet: "A self-attention layer connects all positions with a constant number of sequentially executed operations, but complexity per layer is O(n^2 * d) due to full pairwise matrix multiplication.",
        score: 0.98,
      },
      {
        doi: "10.48550/arXiv.2009.06732",
        title: "Efficient Transformers: A Survey (Tay et al.)",
        snippet: "Standard dot-product attention scales quadratically with sequence length n. Linear complexity O(n) requires specialized low-rank kernels (e.g., Performer, Linear Transformer) or sparse patterns.",
        score: 0.96,
      },
    ],
  },
  {
    id: "claim-3",
    claim: "Supervised pretraining on ImageNet-1K yields superior out-of-distribution robustness compared to contrastive vision-language pretraining.",
    verdict: "CONTRADICTED",
    confidence: 92.1,
    domain: "Computer Vision",
    citations: [
      {
        doi: "10.48550/arXiv.2103.00020",
        title: "Learning Transferable Visual Models From Natural Language Supervision (Radford et al.)",
        snippet: "Zero-shot CLIP models match the accuracy of original ImageNet ResNet-50 while being far more robust to distribution shifts across ImageNetV2, ImageNet-R, and ImageNet-Sketch.",
        score: 0.94,
      },
    ],
  },
];

export const SciVerifySandbox: React.FC = () => {
  const [selectedClaim, setSelectedClaim] = useState<SampleClaim>(PRESET_CLAIMS[0]);
  const [customText, setCustomText] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [stepIndex, setStepIndex] = useState<number>(3); // 0..3

  const handleVerify = (claim: SampleClaim) => {
    soundEngine.playLock();
    setIsVerifying(true);
    setStepIndex(0);

    setTimeout(() => {
      setStepIndex(1);
      setTimeout(() => {
        setStepIndex(2);
        setTimeout(() => {
          setStepIndex(3);
          setIsVerifying(false);
          soundEngine.playImpact();
        }, 350);
      }, 400);
    }, 400);
  };

  const steps = [
    "PARSING ATOMIC CLAIMS & SEMANTIC TRIPLES",
    "CROSS-REFERENCING ARXIV & PUBMED CORPUS",
    "COMPUTING ENTAILMENT TENSOR ALIGNMENT",
    "VERDICT SYNTHESIS COMPLETE",
  ];

  return (
    <div className="rounded-xl border border-indigo-500/30 bg-slate-950/90 p-4 font-mono space-y-4">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-white text-xs">
            SCIVERIFY: INTERACTIVE CITATION & CLAIM REASONING ENGINE
          </span>
        </div>
        <span className="text-[10px] text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
          SEMANTIC ENTAILMENT CLASSIFIER
        </span>
      </div>

      {/* Preset Claims Picker */}
      <div className="space-y-1.5">
        <label className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>SELECT BENCHMARK SCIENTIFIC CLAIM:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {PRESET_CLAIMS.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setSelectedClaim(c);
                handleVerify(c);
              }}
              className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                selectedClaim.id === c.id
                  ? "border-indigo-400 bg-indigo-950/60 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                  : "border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700"
              }`}
            >
              <span className="text-[10px] text-indigo-400 font-bold mb-1">
                BENCHMARK #{idx + 1} • {c.domain}
              </span>
              <p className="line-clamp-2 leading-relaxed text-[11px]">
                {c.claim}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Verification Pipeline Progress */}
      {isVerifying ? (
        <div className="p-4 rounded-lg bg-black/60 border border-slate-800 space-y-2 animate-pulse">
          <div className="flex items-center justify-between text-xs text-indigo-300">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>{steps[stepIndex]}</span>
            </span>
            <span className="text-cyan-400">{((stepIndex + 1) * 25)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${(stepIndex + 1) * 25}%` }}
            />
          </div>
        </div>
      ) : (
        /* Results Card */
        <div className="rounded-lg bg-black/50 border border-slate-800 p-4 space-y-3">
          {/* Claim Verdict Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">GROUND TRUTH VERDICT:</span>
              <span
                className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5 ${
                  selectedClaim.verdict === "SUPPORTED"
                    ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : "bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                }`}
              >
                {selectedClaim.verdict === "SUPPORTED" ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                <span>{selectedClaim.verdict}</span>
              </span>
            </div>

            <div className="text-xs text-slate-300">
              CONFIDENCE SCORE:{" "}
              <strong className="text-cyan-300">{selectedClaim.confidence}%</strong>
            </div>
          </div>

          {/* Claim Statement */}
          <div className="p-3 rounded bg-slate-900/60 border border-slate-800 text-xs text-slate-200 leading-relaxed italic">
            &ldquo;{selectedClaim.claim}&rdquo;
          </div>

          {/* Citations Grounding Evidence */}
          <div className="space-y-2 pt-1">
            <span className="text-[10px] text-slate-400 tracking-wider">
              AUTHORITATIVE CORPUS EVIDENCE & CITATIONS:
            </span>
            <div className="space-y-2">
              {selectedClaim.citations.map((cit, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-800 bg-slate-900/30 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-indigo-400 font-bold truncate max-w-[80%]">
                      {cit.title}
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                      SIMILARITY: {(cit.score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    &ldquo;{cit.snippet}&rdquo;
                  </p>
                  <div className="text-[10px] text-slate-400">
                    DOI: {cit.doi}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
