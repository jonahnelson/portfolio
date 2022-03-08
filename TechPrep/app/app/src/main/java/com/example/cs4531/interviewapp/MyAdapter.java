package com.example.cs4531.interviewapp;

import android.content.Context;
import android.content.Intent;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import java.util.List;

public class MyAdapter extends RecyclerView.Adapter<MyAdapter.MyViewHolder> {
    private List<String> mQuestionList; //List of reported questions
    private List<String> mAnswerList; //List of reported question's answers

    public MyAdapter(List<String> listOfQuestions, List<String> listOfAnswers) {
        mQuestionList = listOfQuestions;
        mAnswerList = listOfAnswers;
    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.row_question, parent, false);
        return new MyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(MyViewHolder holder, int position) {
        holder.tv_question.setText(mQuestionList.get(position).toString());
        holder.tv_answer.setText(mAnswerList.get(position).toString());
    }

    @Override
    public int getItemCount() {
        return mQuestionList.size();
    }

    public class MyViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {
        TextView tv_question;
        TextView tv_answer;

        public MyViewHolder(View itemView) {
            super(itemView);
            tv_question = (TextView)itemView.findViewById(R.id.tv_question);
            tv_answer = (TextView)itemView.findViewById(R.id.tv_answer);
            itemView.setOnClickListener(this);
        }

        @Override
        public void onClick(View view) {
            String question = (String) tv_question.getText();
            String answer = (String) tv_answer.getText();
            Context context = view.getContext();

            Intent intent = new Intent(context, ResolveReportedQuestionActivity.class);
            intent.putExtra("question", question);
            intent.putExtra("answer", answer);
            context.startActivity(intent);
        }
    }
}
