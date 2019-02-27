FROM python:3

WORKDIR /api

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

VOLUME [ "/api" ]

ENV FLASK_APP=todo-api.py
ENV FLASK_ENV=development

EXPOSE 5000

CMD [ "flask", "run", "--host", "0.0.0.0", "--port", "5000" ]